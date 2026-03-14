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

    const [streakResult, medalsResult, relapsesResult, patternsResult, quizResult] = await Promise.all([
      supabase.from("streaks").select("*").eq("user_id", session.user_id).single(),
      supabase.from("medals").select("*").eq("user_id", session.user_id).order("unlocked_at", { ascending: true }),
      supabase.from("relapses").select("*").eq("user_id", session.user_id).order("created_at", { ascending: false }).limit(10),
      supabase.from("trigger_patterns").select("*").eq("user_id", session.user_id).single(),
      supabase.from("quiz_results").select("*").eq("user_id", session.user_id).order("created_at", { ascending: false }).limit(1).single(),
    ]);

    const lastQuizAt = quizResult.data?.created_at || null;

    return NextResponse.json({
      streak: streakResult.data || null,
      medals: medalsResult.data || [],
      relapses: relapsesResult.data || [],
      triggerPatterns: patternsResult.data || null,
      quizResult: quizResult.data || null,
      lastQuizAt,
    });
  } catch (error) {
    console.error("Error en dashboard API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
