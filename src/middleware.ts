import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxy } from "./proxy";

// Landing page domain(s)
const LANDING_HOSTS = ["nomasmigajas.site", "www.nomasmigajas.site"];

// App subdomain
const APP_HOSTS = ["app.nomasmigajas.site"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host")?.split(":")[0] || "";

  // API routes: always run proxy regardless of hostname
  if (pathname.startsWith("/api/")) {
    return proxy(request);
  }

  // Landing page domain: serve landing page content
  if (LANDING_HOSTS.includes(hostname)) {
    // Root → rewrite to /landingpage (internal, URL stays as /)
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/landingpage";
      return NextResponse.rewrite(url);
    }

    // Allow static assets and Next.js internals
    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/favicon") ||
      pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|js|css|woff|woff2|ttf)$/)
    ) {
      return NextResponse.next();
    }

    // Block app routes on landing domain (redirect to app subdomain)
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/quiz") ||
      pathname.startsWith("/journal") ||
      pathname.startsWith("/simulator") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/achievements")
    ) {
      return NextResponse.redirect(
        new URL(pathname, "https://app.nomasmigajas.site")
      );
    }

    return NextResponse.next();
  }

  // App subdomain or Vercel default domain: normal behavior
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image).*)",
  ],
};
