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

    const [streakResult, simulatorLogsResult] = await Promise.all([
      supabase.from("streaks").select("longest_streak_seconds").eq("user_id", session.user_id).single(),
      supabase.from("simulator_logs").select("id", { count: "exact", head: true }).eq("user_id", session.user_id),
    ]);

    const { data: journalEntries } = await supabase
      .from("journal_entries")
      .select("created_at")
      .eq("user_id", session.user_id);

    const uniqueDays = new Set<string>();
    if (journalEntries) {
      journalEntries.forEach((entry) => {
        const day = new Date(entry.created_at).toDateString();
        uniqueDays.add(day);
      });
    }

    const longestStreakDays = streakResult.data?.longest_streak_seconds
      ? Math.floor(streakResult.data.longest_streak_seconds / 86400)
      : 0;

    return NextResponse.json({
      email: session.email,
      longestStreakDays,
      totalSimulatorCalls: simulatorLogsResult.count || 0,
      totalDaysActive: uniqueDays.size,
    });
  } catch (error) {
    console.error("Error en profile API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
