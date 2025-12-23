import { createServerClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = await createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect upload route - require authentication
  if (request.nextUrl.pathname.startsWith('/upload')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Redirect authenticated users away from login page
  if (request.nextUrl.pathname.startsWith('/auth/login')) {
    if (session) {
      return NextResponse.redirect(new URL('/upload', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/upload/:path*', '/auth/login/:path*'],
}

