import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const claims = session.sessionClaims as Record<string, any> | undefined;
  const role = claims?.publicMetadata?.role ?? claims?.metadata?.role;

  // 1. AUTO-REDIRECT: If Admin lands on Home, send to Dashboard
  if (isPublicRoute(req) && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // 2. PROTECT: If non-admin tries to enter /admin, send to Home
  if (isAdminRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};