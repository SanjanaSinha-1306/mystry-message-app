import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";


export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If user is authenticated and tries to access sign-in/sign-up, redirect to dashboard
  if (token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up')||
    url.pathname.startsWith('/verify')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is NOT authenticated and tries to access protected routes, redirect to sign-in
  if (!token && (
    url.pathname.startsWith('/dashboard')
  )) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow all other requests to pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
};