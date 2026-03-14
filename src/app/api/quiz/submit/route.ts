import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";
import { calculateScore } from "@/lib/scoring/quiz-algorithm";

interface QuizAnswer {
  questionId: string;
  optionId: string;
}

interface QuizRequestBody {
  answers: QuizAnswer[];
}

const COOLDOWN_HOURS = 24;

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

    const body: QuizRequestBody = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Respuestas no proporcionadas" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const cooldownThreshold = new Date();
    cooldownThreshold.setHours(cooldownThreshold.getHours() - COOLDOWN_HOURS);

    const { data: recentQuiz } = await supabase
      .from("quiz_results")
      .select("id, created_at")
      .eq("user_id", session.user_id)
      .gte("created_at", cooldownThreshold.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (recentQuiz) {
      return NextResponse.json(
        {
          error: "Ya completaste el cuestionario recientemente",
          cooldown: true,
          nextAttempt: new Date(new Date(recentQuiz.created_at).getTime() + COOLDOWN_HOURS * 60 * 60 * 1000).toISOString(),
        },
        { status: 429 }
      );
    }

    const result = calculateScore(answers);

    const answersMap: Record<string, string> = {};
    for (const answer of answers) {
      answersMap[answer.questionId] = answer.optionId;
    }

    const { error: insertError } = await supabase
      .from("quiz_results")
      .insert({
        user_id: session.user_id,
        score: result.score,
        raw_points: result.rawPoints,
        verdict: result.verdict,
        answers: answersMap,
      });

    if (insertError) {
      console.error("Error guardando resultado:", insertError);
      return NextResponse.json(
        { error: "Error al guardar el resultado" },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ onboarding_completed: true })
      .eq("id", session.user_id);

    if (updateError) {
      console.error("Error actualizando usuario:", updateError);
    }

    // Save updated session to response
    const jsonResponse = NextResponse.json(
      {
        message: "Cuestionario completado",
        result: {
          score: result.score,
          rawPoints: result.rawPoints,
          verdict: result.verdict,
          level: result.level,
          color: result.color,
        },
      },
      { status: 200 }
    );

    const sessionToSave = await getIronSession<SessionData>(request, jsonResponse, sessionOptions);
    sessionToSave.user_id = session.user_id;
    sessionToSave.email = session.email;
    sessionToSave.onboarding_completed = true;
    sessionToSave.subscription_status = session.subscription_status;
    await sessionToSave.save();

    return jsonResponse;
  } catch (error) {
    console.error("Error procesando cuestionario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
