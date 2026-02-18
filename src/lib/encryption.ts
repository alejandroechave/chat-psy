/**
 * Encryption Service for Crisis Messages
 * 
 * ⚠️ CRITICAL: This module handles sensitive message encryption/decryption.
 * All messages in the database MUST be encrypted using this service.
 *
 * Algorithm: AES-256-CBC
 * - Mode: Cipher Block Chaining (CBC)
 * - Key: 32 bytes (256 bits) from ENCRYPTION_KEY env variable
 * - IV: Random 16 bytes generated per message and prepended to ciphertext
 *
 * Usage:
 *   import { encryptMessage, decryptMessage } from '@/lib/encryption';
 *   
 *   // Encrypt before storing
 *   const encrypted = encryptMessage('Hello, this is sensitive');
 *   await prisma.message.create({ data: { content: encrypted } });
 *   
 *   // Decrypt when reading
 *   const message = await prisma.message.findUnique({ where: { id } });
 *   const plaintext = decryptMessage(message.content);
 */

import crypto from 'crypto';

/**
 * Get encryption key from environment or generate fallback (dev only)
 * 
 * ⚠️ PRODUCTION: Always set ENCRYPTION_KEY in environment
 * ⚠️ DEVELOPMENT: Generate via: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    console.warn(
      '[Encryption] ENCRYPTION_KEY not set. Using random key (data will not be recoverable). ' +
      'Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
    return crypto.randomBytes(32);
  }

  try {
    // Expect 64-char hex string (32 bytes)
    return Buffer.from(key, 'hex');
  } catch {
    // Fallback: derive key from string
    return crypto.createHash('sha256').update(key).digest();
  }
}

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // bytes (128 bits)

/**
 * Encrypt a plaintext message using AES-256-CBC
 * 
 * @param plaintext - Raw message content to encrypt
 * @returns Encrypted string in format: "ivHex:ciphertextHex"
 * @throws Error if encryption fails
 */
export function encryptMessage(plaintext: string): string {
  try {
    const key = getEncryptionKey();
    
    // Generate random IV for this specific message
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher with AES-256-CBC
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Encrypt the plaintext
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Format: "IV:CIPHERTEXT" - prepend IV so it can be extracted during decryption
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('[Encryption Error]', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to encrypt message');
  }
}

/**
 * Decrypt an encrypted message
 * 
 * Safely handles decryption errors by returning a generic message.
 * This prevents leaking information about encryption keys or formats.
 * 
 * @param encrypted - Encrypted string in format "ivHex:ciphertextHex"
 * @returns Decrypted plaintext, or "[Contenido no disponible]" if decryption fails
 */
export function decryptMessage(encrypted: string): string {
  try {
    const key = getEncryptionKey();
    
    // Parse the format: "IV:CIPHERTEXT"
    const parts = encrypted.split(':');
    
    if (parts.length !== 2) {
      console.warn('[Decryption] Invalid format - expected "iv:ciphertext"');
      return '[Contenido no disponible]';
    }
    
    const [ivHex, ciphertextHex] = parts;
    
    // Recover IV from hex string
    const iv = Buffer.from(ivHex, 'hex');
    
    if (iv.length !== IV_LENGTH) {
      console.warn('[Decryption] Invalid IV length');
      return '[Contenido no disponible]';
    }
    
    // Create decipher with the recovered IV
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    // Decrypt the ciphertext
    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // Return generic message on any decryption error
    // This prevents information leakage about keys or encryption format
    console.warn(
      '[Decryption Error]',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return '[Contenido no disponible]';
  }
}

/**
 * Verify that an encrypted message has the correct format
 * 
 * Useful for validation without fully decrypting.
 * Format should be: "ivHex:ciphertextHex"
 * 
 * @param encrypted - Encrypted string to validate
 * @returns true if format is valid, false otherwise
 */
export function isValidEncryptedFormat(encrypted: string): boolean {
  try {
    const parts = encrypted.split(':');
    
    if (parts.length !== 2) {
      return false;
    }
    
    const [ivHex, ciphertextHex] = parts;
    
    // Validate both parts are valid hex strings
    Buffer.from(ivHex, 'hex');
    Buffer.from(ciphertextHex, 'hex');
    
    // Validate IV length is correct
    if (Buffer.from(ivHex, 'hex').length !== IV_LENGTH) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Hash the encryption key for logging/auditing
 * 
 * ⚠️ NEVER log the actual encryption key
 * 
 * @returns SHA-256 hash of the key (first 16 chars)
 */
export function hashEncryptionKey(): string {
  const key = getEncryptionKey();
  return crypto
    .createHash('sha256')
    .update(key)
    .digest('hex')
    .substring(0, 16);
}
