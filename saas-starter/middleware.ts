import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public and admin routes
const isPublicRoute = createRouteMatcher([
  "/", 
  "/api/webhook/register", 
  "/sign-in(.*)", 
  "/sign-up(.*)"
]);
const isAdminRoute = createRouteMatcher([
  "/admin(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except public ones
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Role-based logic for admin routes
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    // Defensive: check for role in multiple places
    const role =
      (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role ||
      (sessionClaims as { role?: string } | undefined)?.role ||
      (sessionClaims as { customRole?: string } | undefined)?.customRole;

    if (!userId || role !== "admin") {
      // Redirect non-admins to dashboard or sign-in
      return Response.redirect(new URL("/dashboard", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};