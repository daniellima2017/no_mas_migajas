import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.user_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const [medalsResult, relapsesResult, patternsResult] = await Promise.all([
      supabase.from("medals").select("*").eq("user_id", session.user_id).order("unlocked_at", { ascending: true }),
      supabase.from("relapses").select("*").eq("user_id", session.user_id).order("created_at", { ascending: false }).limit(20),
      supabase.from("trigger_patterns").select("*").eq("user_id", session.user_id).single(),
    ]);

    return NextResponse.json({
      medals: medalsResult.data || [],
      relapses: relapsesResult.data || [],
      triggerPatterns: patternsResult.data || null,
    });
  } catch (error) {
    console.error("Error en achievements API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
