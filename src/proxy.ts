import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { createClient } from "@supabase/supabase-js";
import { SessionData, sessionOptions } from "@/lib/auth/session";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface SubscriptionCacheEntry {
  status: string;
  checkedAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const subscriptionCache = new Map<string, SubscriptionCacheEntry>();

const SIMULATOR_LIMIT = 30;
const API_LIMIT = 100;
const WINDOW_MS = 60 * 1000;
const SUBSCRIPTION_CHECK_INTERVAL = 5 * 60 * 1000; // Re-check every 5 minutes

const publicApiPaths = [
  "/api/webhooks",
  "/api/dev",
  "/api/auth/login",
  "/api/auth/check",
  "/api/auth/forgot-password",
];

// Landing page domain(s)
const LANDING_HOSTS = ["nomasmigajas.site", "www.nomasmigajas.site"];

function checkRateLimit(
  key: string,
  limit: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

async function handleApiRoute(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Skip public API paths
  if (publicApiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  const isAuthenticated = session.user_id && session.user_id !== "";

  // Block unauthenticated API access
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  // Check subscription status (re-verify from DB periodically)
  const now = Date.now();
  const cached = subscriptionCache.get(session.user_id);
  let subscriptionStatus = session.subscription_status;

  if (!cached || now - cached.checkedAt > SUBSCRIPTION_CHECK_INTERVAL) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data } = await supabase
        .from("users")
        .select("subscription_status")
        .eq("id", session.user_id)
        .single();

      if (data) {
        subscriptionStatus = data.subscription_status;
        subscriptionCache.set(session.user_id, { status: data.subscription_status, checkedAt: now });

        if (data.subscription_status !== session.subscription_status) {
          session.subscription_status = data.subscription_status;
          await session.save();
        }
      }
    } catch {
      // On DB error, fall back to session value
    }
  } else {
    subscriptionStatus = cached.status as "active" | "inactive";
  }

  if (subscriptionStatus === "inactive") {
    session.destroy();
    return NextResponse.json(
      { error: "Suscripcion inactiva" },
      { status: 403 }
    );
  }

  // Rate limiting
  const isSimulatorRoute = pathname.startsWith("/api/simulator/");
  const rateLimitKey = isSimulatorRoute
    ? `simulator:${session.user_id}`
    : `api:${session.user_id}`;
  const limit = isSimulatorRoute ? SIMULATOR_LIMIT : API_LIMIT;

  const { allowed, remaining } = checkRateLimit(rateLimitKey, limit);

  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta mas tarde." },
      { status: 429 }
    );
  }

  response.headers.set("X-RateLimit-Remaining", remaining.toString());

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host")?.split(":")[0] || "";

  // API routes: always run auth/rate-limit logic regardless of hostname
  if (pathname.startsWith("/api/")) {
    return handleApiRoute(request);
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
      pathname.startsWith("/progress") ||
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
