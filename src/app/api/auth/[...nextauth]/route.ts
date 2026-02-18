/**
 * NextAuth API Route Handler
 * Handles all authentication endpoints using NextAuth v5
 */

import { NextRequest, NextResponse } from 'next/server';

// For now, return 404 until NextAuth v5 is properly configured
export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'NextAuth endpoint' }, { status: 200 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'NextAuth endpoint' }, { status: 200 });
}
