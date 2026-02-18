import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Health Check Endpoint
 *
 * Used by Docker containers to verify:
 * 1. Application is running
 * 2. Database connection is alive
 * 3. Basic functionality is available
 *
 * healthcheck in docker-compose.yml:
 *   test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
 *   interval: 10s
 *   timeout: 5s
 *   retries: 3
 *   start_period: 40s
 */

export async function GET() {
  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Health Check] Error:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
