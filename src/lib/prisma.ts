/**
 * Prisma Client Module for Next.js
 * Provides runtime access to Prisma ORM for API routes and server components
 *
 * ⚠️ IMPORTANT: This module is ONLY for runtime use in API routes and server actions.
 * Do NOT use in server components that might be statically generated at build time.
 *
 * Usage in API routes:
 *   import { getPrisma } from '@/lib/prisma';
 *   const prisma = await getPrisma();
 *   const users = await prisma.user.findMany();
 */

let prismaInstance: any = null;

export async function getPrisma() {
  if (!prismaInstance) {
    try {
      // @ts-ignore: Dynamic import resolved only at runtime
      const { default: Client } = await import('@prisma/client');
      // @ts-ignore: Constructor signature resolved at runtime
      prismaInstance = new Client();
    } catch (error) {
      console.error('Failed to initialize Prisma Client:', error);
      throw new Error('Prisma Client is not available. Ensure DATABASE_URL is configured.');
    }
  }

  return prismaInstance;
}

/**
 * Disconnect Prisma Client on shutdown
 */
export async function disconnectPrisma() {
  if (prismaInstance && prismaInstance.$disconnect) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

export default { getPrisma, disconnectPrisma };
