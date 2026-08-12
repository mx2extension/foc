import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is a pass-through. 
// Authentication is handled directly inside the dashboard pages via localStorage.
export function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}