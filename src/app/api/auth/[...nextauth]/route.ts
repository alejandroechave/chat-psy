/**
 * NextAuth API Route Handler
 * Handles all authentication endpoints using NextAuth v5
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// For now, return 404 until NextAuth v5 is properly configured
export async function GET(_request: NextRequest) {
  return NextResponse.json({ error: 'NextAuth endpoint' }, { status: 200 });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: 'NextAuth endpoint' }, { status: 200 });
}
