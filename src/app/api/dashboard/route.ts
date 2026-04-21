import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";
import { buildMonitoringSnapshot } from "@/lib/monitoring/snapshot";
import type { MonitoringDailyState } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.user_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const now = new Date();
    const recentWindowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const [
      userResult,
      streakResult,
      medalsResult,
      relapsesResult,
      patternsResult,
      quizResult,
      recentSimulatorResult,
      recentJournalResult,
    ] = await Promise.all([
      supabase.from("users").select("created_at").eq("id", session.user_id).single(),
      supabase.from("streaks").select("*").eq("user_id", session.user_id).single(),
      supabase.from("medals").select("*").eq("user_id", session.user_id).order("unlocked_at", { ascending: true }),
      supabase.from("relapses").select("*").eq("user_id", session.user_id).order("created_at", { ascending: false }).limit(10),
      supabase.from("trigger_patterns").select("*").eq("user_id", session.user_id).single(),
      supabase.from("quiz_results").select("*").eq("user_id", session.user_id).order("created_at", { ascending: false }).limit(1).single(),
      supabase
        .from("simulator_logs")
        .select("id", { count: "exact" })
        .eq("user_id", session.user_id)
        .gte("created_at", recentWindowStart),
      supabase
        .from("journal_entries")
        .select("id", { count: "exact" })
        .eq("user_id", session.user_id)
        .gte("created_at", recentWindowStart),
    ]);

    const lastQuizAt = quizResult.data?.created_at || null;
    const monitoring = buildMonitoringSnapshot({
      streak: streakResult.data || null,
      relapses: relapsesResult.data || [],
      triggerPatterns: patternsResult.data || null,
      quizResult: quizResult.data || null,
      userCreatedAt: userResult.data?.created_at || null,
      recentSimulatorUsageCount: recentSimulatorResult.count || 0,
      recentJournalUsageCount: recentJournalResult.count || 0,
      now,
    });

    const monitoringStatePayload = {
      user_id: session.user_id,
      state_date: monitoring.mission_date,
      vulnerability: monitoring.vulnerability,
      risk_percent: monitoring.risk_percent,
      pattern_label: monitoring.pattern_label,
      mission_key: monitoring.mission_key,
    };

    const monitoringStateResult = await supabase
      .from("monitoring_daily_states")
      .upsert(monitoringStatePayload, { onConflict: "user_id,state_date" })
      .select("*")
      .single();

    const monitoringHistoryResult = await supabase
      .from("monitoring_daily_states")
      .select("*")
      .eq("user_id", session.user_id)
      .order("state_date", { ascending: false })
      .limit(14);

    const currentMonitoringState = monitoringStateResult.data as MonitoringDailyState | null;
    const monitoringHistory = (monitoringHistoryResult.data || []) as MonitoringDailyState[];

    return NextResponse.json({
      viewerId: session.user_id,
      streak: streakResult.data || null,
      medals: medalsResult.data || [],
      relapses: relapsesResult.data || [],
      triggerPatterns: patternsResult.data || null,
      quizResult: quizResult.data || null,
      lastQuizAt,
      monitoring,
      missionCompletedAt: currentMonitoringState?.mission_completed_at || null,
      monitoringHistory,
    });
  } catch (error) {
    console.error("Error en dashboard API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
