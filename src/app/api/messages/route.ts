/**
 * API Route: Create Message
 * POST /api/messages
 *
 * Creates a new encrypted message in a crisis session.
 * ⚠️ The message is automatically encrypted before storage.
 *
 * Request body:
 * {
 *   "sessionId": "clx...",
 *   "senderId": "clx...",
 *   "content": "Hello, volunteer"
 * }
 *
 * Response:
 * {
 *   "id": "clx...",
 *   "sessionId": "clx...",
 *   "senderId": "clx...",
 *   "content": "iv:authTag:encrypted",
 *   "createdAt": "2026-02-18T..."
 * }
 */

import { getPrisma } from '@/lib/prisma';
import { encryptMessage, isValidEncryptedFormat } from '@/lib/encryption';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { sessionId, senderId, content } = await req.json();

    // Validate input
    if (!sessionId || !senderId || !content) {
      return Response.json(
        { error: 'Missing required fields: sessionId, senderId, content' },
        { status: 400 }
      );
    }

    if (typeof content !== 'string' || content.trim().length === 0) {
      return Response.json(
        { error: 'Content must be a non-empty string' },
        { status: 400 }
      );
    }

    // Verify session exists
    const session = await prisma.crisisSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return Response.json(
        { error: 'Crisis session not found' },
        { status: 404 }
      );
    }

    // Verify sender exists
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      return Response.json(
        { error: 'Sender user not found' },
        { status: 404 }
      );
    }

    // Encrypt message content
    const encryptedContent = encryptMessage(content);

    // Create message in database
    const message = await prisma.message.create({
      data: {
        sessionId,
        senderId,
        content: encryptedContent,
      },
      select: {
        id: true,
        sessionId: true,
        senderId: true,
        createdAt: true,
        // Note: DO NOT select 'content' in production unless decrypting for the user
      },
    });

    return Response.json(message, { status: 201 });
  } catch (error) {
    console.error('Failed to create message:', error);
    return Response.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

/**
 * API Route: Get Messages
 * GET /api/messages?sessionId=clx...
 *
 * Retrieves all messages for a session, automatically decrypting them.
 * ⚠️ CAUTION: Be careful exposing decrypted messages to clients.
 * Consider authorization checks.
 */
export async function GET(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return Response.json(
        { error: 'Missing sessionId query parameter' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Note: Content is still encrypted in the DB
    // Decrypt ONLY if necessary for the response, and consider auth
    // For now, just return metadata
    const safeMessages = messages.map(({ content, ...rest }: any) => ({
      ...rest,
      hasContent: isValidEncryptedFormat(content),
    }));

    return Response.json(safeMessages, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return Response.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
