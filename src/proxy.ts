import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/*
 * Proxy (Next.js 16's renamed Middleware). Two jobs, and it only does real work
 * for the admin app — public requests fall straight through:
 *
 *  1. Subdomain routing — admin.loopsoop.in/login → the /admin/login route, etc.
 *     The public site (loopsoop.in) never serves /admin (redirected to home).
 *  2. Optimistic auth gate — unauthenticated admin routes redirect to /login;
 *     an authenticated user on /login is sent to the dashboard.
 *
 * This is only an OPTIMISTIC check (Next.js guidance). Real authorization is
 * enforced by Supabase Row Level Security (is_admin()) at the database.
 */

const PUBLIC_PROD_HOSTS = new Set(["loopsoop.in", "www.loopsoop.in"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") || "").toLowerCase().split(":")[0];
  const isAdminSubdomain = host.startsWith("admin.");

  // Admin subdomain: map bare paths onto the /admin/* routes.
  if (isAdminSubdomain) {
    const adminPath = pathname.startsWith("/admin")
      ? pathname
      : pathname === "/"
        ? "/admin/dashboard"
        : `/admin${pathname}`;
    return handleAdmin(request, adminPath, true, true);
  }

  // Direct /admin/* (localhost dev). Never expose admin on the public prod domain.
  if (pathname.startsWith("/admin")) {
    if (PUBLIC_PROD_HOSTS.has(host)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return handleAdmin(request, pathname, false, false);
  }

  // Public site — no session work.
  return NextResponse.next();
}

async function handleAdmin(
  request: NextRequest,
  adminPath: string,
  rewrite: boolean,
  isSubdomain: boolean,
) {
  const makeResponse = () =>
    rewrite
      ? NextResponse.rewrite(new URL(adminPath, request.url))
      : NextResponse.next({ request });

  let response = makeResponse();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = makeResponse();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = adminPath === "/admin/login";
  // User-facing paths differ on the subdomain (bare) vs dev (/admin/*).
  const loginPath = isSubdomain ? "/login" : "/admin/login";
  const dashboardPath = isSubdomain ? "/dashboard" : "/admin/dashboard";

  if (!user && !isLogin) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }
  if (user && isLogin) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return response;
}

export const config = {
  // Run on everything except static assets. The function itself early-returns
  // for non-admin requests, so public pages pay no auth cost.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)",
  ],
};
