import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.user_id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = (await request.json()) as {
      missionDate?: string;
      missionKey?: string;
      vulnerability?: string;
      riskPercent?: number;
      patternLabel?: string;
      detectedState?: string;
      confidenceLevel?: string;
      crisisMode?: boolean;
      ritualCheckinState?: string;
    };

    if (
      !body.missionDate ||
      !body.missionKey ||
      !body.vulnerability ||
      typeof body.riskPercent !== "number" ||
      !body.patternLabel ||
      !body.detectedState ||
      !body.confidenceLevel ||
      !body.ritualCheckinState
    ) {
      return NextResponse.json({ error: "Datos incompletos para registrar el ritual" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("monitoring_daily_states")
      .upsert(
        {
          user_id: session.user_id,
          state_date: body.missionDate,
          vulnerability: body.vulnerability,
          risk_percent: body.riskPercent,
          detected_state: body.detectedState,
          confidence_level: body.confidenceLevel,
          crisis_mode: body.crisisMode || false,
          pattern_label: body.patternLabel,
          mission_key: body.missionKey,
          ritual_checkin_state: body.ritualCheckinState,
          ritual_completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,state_date" }
      )
      .select("ritual_completed_at, ritual_checkin_state")
      .single();

    if (error) {
      console.error("Error al registrar ritual:", error);
      return NextResponse.json({ error: "No se pudo registrar el ritual" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ritualCompletedAt: data?.ritual_completed_at || null,
      ritualCheckinState: data?.ritual_checkin_state || null,
    });
  } catch (error) {
    console.error("Error en monitoring ritual API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
