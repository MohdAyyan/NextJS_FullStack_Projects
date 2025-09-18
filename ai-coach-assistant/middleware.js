import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/resume(.*)',
  '/interview(.*)',
  '/ai-cover-letter(.*)',
  '/onboarding(.*)',
]);

export default clerkMiddleware((auth, req) => {
  try {
    const { userId, redirectToSignIn } = auth();

    // ✅ SAFELY check if pathname exists
    if (!userId && req?.nextUrl && isProtectedRoute(req.nextUrl.pathname)) {
      return redirectToSignIn();
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.next(); // fail-safe
  }
});

export const config = {
  matcher: [
    // ✅ Match only routes we care about (no static or public files)
    '/((?!_next|favicon.ico|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};
