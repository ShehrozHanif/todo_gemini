// backend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store for rate limiting
const ipRequests = new Map<string, { count: number; lastReset: number }>();
const MAX_REQUESTS = 10;
const WINDOW_SIZE_MS = 1000; // 1 second

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip || '127.0.0.1'; // Fallback to localhost if IP is not available

    const now = Date.now();
    const client = ipRequests.get(ip);

    if (client && client.lastReset + WINDOW_SIZE_MS > now) {
      // Within the same window
      if (client.count >= MAX_REQUESTS) {
        return new NextResponse(
          JSON.stringify({ message: 'Too many requests. Please try again later.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
      client.count++;
    } else {
      // New window or first request
      ipRequests.set(ip, { count: 1, lastReset: now });
    }
  }

  return NextResponse.next();
}

// Configuration for the middleware to match API routes
export const config = {
  matcher: '/api/:path*',
};
