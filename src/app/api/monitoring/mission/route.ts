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
    };

    if (
      !body.missionDate ||
      !body.missionKey ||
      !body.vulnerability ||
      typeof body.riskPercent !== "number" ||
      !body.patternLabel
    ) {
      return NextResponse.json({ error: "Datos incompletos para registrar la mision" }, { status: 400 });
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
          pattern_label: body.patternLabel,
          mission_key: body.missionKey,
          mission_completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,state_date" }
      )
      .select("mission_completed_at")
      .single();

    if (error) {
      console.error("Error al registrar mision:", error);
      return NextResponse.json({ error: "No se pudo registrar la mision" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      missionCompletedAt: data?.mission_completed_at || null,
    });
  } catch (error) {
    console.error("Error en monitoring mission API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
