import { NextRequest } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";
import { shouldUseFallback, logApiError } from "@/lib/ai/circuit-breaker";
import {
  SIMULATOR_SYSTEM_PROMPT_RECEIVED,
  SIMULATOR_SYSTEM_PROMPT_SENDING,
  SIMULATOR_USER_PROMPT_RECEIVED,
  SIMULATOR_USER_PROMPT_SENDING,
  parseSimulatorResponse,
} from "@/lib/ai/prompts/simulator";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENAI_MODEL = "gpt-4o-mini";

interface AnalyzeRequest {
  text: string;
  mode: "received" | "sending";
}

export async function POST(request: NextRequest) {
  try {
    const dummyResponse = new Response();
    const session = await getIronSession<SessionData>(request, dummyResponse, sessionOptions);

    if (!session.user_id) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user_id;

    const body: AnalyzeRequest = await request.json();
    const { text, mode } = body;

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Texto requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sanitizedText = text.trim().slice(0, 2000);

    if (!sanitizedText) {
      return new Response(JSON.stringify({ error: "Texto vacio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const validModes = ["received", "sending"];
    const sanitizedMode = validModes.includes(mode) ? mode : "received";

    const useFallback = await shouldUseFallback();

    const groqApiKey = process.env.GROQ_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    let provider: "groq" | "openai";
    let model: string;

    if (useFallback || !groqApiKey) {
      if (!openaiApiKey) {
        return new Response(
          JSON.stringify({ error: "Servicio no disponible" }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      provider = "openai";
      model = OPENAI_MODEL;
    } else {
      provider = "groq";
      model = GROQ_MODEL;
    }

    const systemPrompt = sanitizedMode === "received"
      ? SIMULATOR_SYSTEM_PROMPT_RECEIVED
      : SIMULATOR_SYSTEM_PROMPT_SENDING;

    const userPromptTemplate = sanitizedMode === "received"
      ? SIMULATOR_USER_PROMPT_RECEIVED
      : SIMULATOR_USER_PROMPT_SENDING;

    const userPrompt = userPromptTemplate.replace("{input}", sanitizedText);

    const aiProvider =
      provider === "groq"
        ? createOpenAI({
            apiKey: groqApiKey,
            baseURL: GROQ_BASE_URL,
          })
        : createOpenAI({
            apiKey: openaiApiKey,
          });

    const result = streamText({
      model: aiProvider(model),
      system: systemPrompt,
      prompt: userPrompt,
      async onFinish({ text, finishReason }) {
        if (finishReason === "stop" && text) {
          const supabase = createAdminClient();
          const parsed = parseSimulatorResponse(text);

          await supabase.from("simulator_logs").insert({
            user_id: userId,
            input_text: sanitizedText,
            mode: sanitizedMode,
            translation: text,
            verdict: parsed.classification,
            ai_provider: provider,
          });
        }
      },
      onError({ error }) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logApiError(provider, errorMessage);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error en simulador:", error);

    return new Response(
      JSON.stringify({ error: "Error procesando la solicitud" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
