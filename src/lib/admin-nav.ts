/*
 * Admin URLs differ by host: on the admin subdomain they're bare (/login,
 * /dashboard); in local dev they're prefixed (/admin/login, /admin/dashboard).
 * The proxy maps both onto the same /admin/* route files. Client-side only.
 */
export function adminPath(path: `/${string}`): string {
  if (
    typeof window !== "undefined" &&
    window.location.host.toLowerCase().startsWith("admin.")
  ) {
    return path;
  }
  return `/admin${path}`;
}
