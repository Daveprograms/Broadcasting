import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/login", "/signup", "/", "/api/signup"].includes(nextUrl.pathname);

  // If api auth route, do not redirect
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in and trying to access login/signup
  if (isPublicRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect to login if not logged in and trying to access dashboard or admin
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // Role checking for admin
  if (nextUrl.pathname.startsWith("/admin")) {
    const userRole = (req.auth?.user as { role?: string })?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
