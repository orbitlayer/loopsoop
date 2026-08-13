import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/*
 * Proxy (Next.js 16's renamed Middleware). Optimistic auth gate for the admin,
 * which is served at /admin on the main domain. Unauthenticated admin routes go
 * to /admin/login; an authenticated user on /admin/login goes to the dashboard.
 * Real authorization is enforced again server-side in every Server Action.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  const isLogin = pathname === "/admin/login";

  if (!session && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  return NextResponse.next();
}

// Only run on admin routes — public pages pay no cost.
export const config = {
  matcher: ["/admin/:path*"],
};
