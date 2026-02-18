/**
 * API Route: Crisis Sessions
 * 
 * POST /api/crisis-sessions - Create new session
 * GET /api/crisis-sessions - List sessions (with filters)
 * PATCH /api/crisis-sessions/[id] - Update session (close, assign volunteer)
 *
 * ⚠️ IMPORTANT: Implement proper authentication and authorization.
 */

import { getPrisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

/**
 * POST /api/crisis-sessions
 * Create a new crisis session for a user.
 */
export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { userId, volunteerId } = await req.json();

    if (!userId) {
      return Response.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify volunteer exists if provided
    if (volunteerId) {
      const volunteer = await prisma.user.findUnique({
        where: { id: volunteerId },
      });

      if (!volunteer) {
        return Response.json(
          { error: 'Volunteer not found' },
          { status: 404 }
        );
      }
    }

    // Create session
    const session = await prisma.crisisSession.create({
      data: {
        userId,
        volunteerId: volunteerId || null,
        status: 'OPEN',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        volunteer: {
          select: { id: true, name: true },
        },
      },
    });

    return Response.json(session, { status: 201 });
  } catch (error) {
    console.error('Failed to create crisis session:', error);
    return Response.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/crisis-sessions
 * Retrieve sessions with optional filters.
 *
 * Query params:
 * - status: OPEN | CLOSED
 * - userId: filter by user
 * - volunteerId: filter by assigned volunteer
 */
export async function GET(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const volunteerId = searchParams.get('volunteerId');

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (volunteerId) where.volunteerId = volunteerId;

    const sessions = await prisma.crisisSession.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        volunteer: {
          select: { id: true, name: true },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to prevent performance issues
    });

    return Response.json(sessions, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch crisis sessions:', error);
    return Response.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
