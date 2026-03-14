import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";

interface ResetRequest {
  reason: string;
  cravingLevel: number;
}

const MAX_REASON_LENGTH = 500;
const MIN_CRAVING_LEVEL = 1;
const MAX_CRAVING_LEVEL = 10;

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.user_id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body: ResetRequest = await request.json();
    const { reason, cravingLevel } = body;

    const sanitizedReason = typeof reason === "string"
      ? reason.trim().slice(0, MAX_REASON_LENGTH)
      : "";

    if (!sanitizedReason) {
      return NextResponse.json(
        { error: "El motivo es requerido" },
        { status: 400 }
      );
    }

    const validatedCravingLevel = Math.max(
      MIN_CRAVING_LEVEL,
      Math.min(MAX_CRAVING_LEVEL, Number(cravingLevel) || 5)
    );

    const supabase = createAdminClient();

    const { data: currentStreak, error: streakError } = await supabase
      .from("streaks")
      .select("id, started_at, longest_streak_seconds")
      .eq("user_id", session.user_id)
      .single();

    if (streakError || !currentStreak) {
      return NextResponse.json(
        { error: "No se encontro el streak actual" },
        { status: 404 }
      );
    }

    const now = new Date();
    const startedAt = new Date(currentStreak.started_at);
    const streakDurationSeconds = Math.floor(
      (now.getTime() - startedAt.getTime()) / 1000
    );

    const longestStreakSeconds = Math.max(
      currentStreak.longest_streak_seconds || 0,
      streakDurationSeconds
    );

    const { data: relapseData, error: relapseError } = await supabase
      .from("relapses")
      .insert({
        user_id: session.user_id,
        reason: sanitizedReason,
        craving_level: validatedCravingLevel,
        streak_duration_seconds: streakDurationSeconds,
      })
      .select("id")
      .single();

    if (relapseError || !relapseData) {
      console.error("Error guardando recaida:", relapseError);
      return NextResponse.json(
        { error: "Error al registrar la recaida" },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("streaks")
      .update({
        started_at: now.toISOString(),
        longest_streak_seconds: longestStreakSeconds,
        is_active: true,
      })
      .eq("id", currentStreak.id);

    if (updateError) {
      console.error("Error actualizando streak:", updateError);
      return NextResponse.json(
        { error: "Error al reiniciar el streak" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Recaida registrada",
        relapse_id: relapseData.id,
        previous_streak_duration: streakDurationSeconds,
        longest_streak_seconds: longestStreakSeconds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error procesando recaida:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
