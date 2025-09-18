import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export async function  middleware(request: NextRequest) {
  
  const url = request.nextUrl  
  const token =await getToken({ req: request })
   if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
    
}   
export const config = {
  matcher: [
    '/',
    '/sign-up',
    '/sign-in',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}