import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";
import { buildMonitoringSnapshot } from "@/lib/monitoring/snapshot";
import type { MonitoringDailyState } from "@/types";
import { getStreakSecondsFromStartedAt, syncMedalsForUser } from "@/lib/medals/sync";

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

    const initialMonitoring = buildMonitoringSnapshot({
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
      state_date: initialMonitoring.mission_date,
      vulnerability: initialMonitoring.vulnerability,
      risk_percent: initialMonitoring.risk_percent,
      detected_state: initialMonitoring.detected_state,
      confidence_level: initialMonitoring.confidence_level,
      crisis_mode: initialMonitoring.crisis_mode,
      pattern_label: initialMonitoring.pattern_label,
      mission_key: initialMonitoring.mission_key,
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
    const createdAt = userResult.data?.created_at ? new Date(userResult.data.created_at).getTime() : null;
    const elapsedJourneyDays =
      createdAt !== null
        ? Math.max(1, Math.floor((now.getTime() - createdAt) / (1000 * 60 * 60 * 24)) + 1)
        : 1;
    const journeyDay = Math.max(elapsedJourneyDays, monitoringHistory.length);
    const monitoring = buildMonitoringSnapshot({
      streak: streakResult.data || null,
      relapses: relapsesResult.data || [],
      triggerPatterns: patternsResult.data || null,
      quizResult: quizResult.data || null,
      userCreatedAt: userResult.data?.created_at || null,
      journeyDayOverride: journeyDay,
      recentSimulatorUsageCount: recentSimulatorResult.count || 0,
      recentJournalUsageCount: recentJournalResult.count || 0,
      monitoringHistory,
      now,
    });
    const streakSeconds = getStreakSecondsFromStartedAt(streakResult.data?.started_at || null, now);
    const syncedMedals = await syncMedalsForUser(
      session.user_id,
      streakSeconds,
      (medalsResult.data || []) as []
    );

    return NextResponse.json({
      viewerId: session.user_id,
      streak: streakResult.data || null,
      medals: syncedMedals,
      relapses: relapsesResult.data || [],
      triggerPatterns: patternsResult.data || null,
      quizResult: quizResult.data || null,
      monitoring,
      missionCompletedAt: currentMonitoringState?.mission_completed_at || null,
      ritualCompletedAt: currentMonitoringState?.ritual_completed_at || null,
      ritualCheckinState: currentMonitoringState?.ritual_checkin_state || null,
      monitoringHistory,
    });
  } catch (error) {
    console.error("Error en dashboard API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
