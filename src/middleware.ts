import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { createClient } from "@supabase/supabase-js";

interface SessionData {
  user_id: string;
  email: string;
  onboarding_completed: boolean;
  subscription_status: "active" | "inactive";
}

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
const SUBSCRIPTION_CHECK_INTERVAL = 5 * 60 * 1000;

const publicApiPaths = [
  "/api/webhooks",
  "/api/dev",
  "/api/auth/login",
  "/api/auth/check",
  "/api/auth/forgot-password",
];

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public API paths
  if (publicApiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if env vars are available
  const sessionPassword = process.env.IRON_SESSION_PASSWORD;
  if (!sessionPassword) {
    console.error("IRON_SESSION_PASSWORD not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const sessionOptions = {
    password: sessionPassword,
    cookieName: "nmm_session",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    },
  };

  try {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    const isAuthenticated = session.user_id && session.user_id !== "";

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Check subscription status
    const now = Date.now();
    const cached = subscriptionCache.get(session.user_id);
    let subscriptionStatus = session.subscription_status;

    if (!cached || now - cached.checkedAt > SUBSCRIPTION_CHECK_INTERVAL) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          });
          const { data } = await supabase
            .from("users")
            .select("subscription_status")
            .eq("id", session.user_id)
            .single();

          if (data) {
            subscriptionStatus = data.subscription_status;
            subscriptionCache.set(session.user_id, {
              status: data.subscription_status,
              checkedAt: now,
            });

            if (data.subscription_status !== session.subscription_status) {
              session.subscription_status = data.subscription_status;
              await session.save();
            }
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
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
