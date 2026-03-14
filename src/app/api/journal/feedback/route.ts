import { NextRequest } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";
import { shouldUseFallback, logApiError } from "@/lib/ai/circuit-breaker";
import { JOURNAL_SYSTEM_PROMPT, JOURNAL_USER_PROMPT } from "@/lib/ai/prompts/journal";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const OPENAI_MODEL = "gpt-4o-mini";

interface JournalFeedbackRequest {
  content: string;
  entry_id?: string;
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

    const body: JournalFeedbackRequest = await request.json();
    const { content, entry_id } = body;

    if (!content || typeof content !== "string") {
      return new Response(JSON.stringify({ error: "Contenido requerido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sanitizedContent = content.trim().slice(0, 5000);

    if (!sanitizedContent) {
      return new Response(JSON.stringify({ error: "Contenido vacio" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    const userPrompt = JOURNAL_USER_PROMPT.replace("{entry}", sanitizedContent);

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
      system: JOURNAL_SYSTEM_PROMPT,
      prompt: userPrompt,
      async onFinish({ text, finishReason }) {
        if (finishReason === "stop" && text && entry_id) {
          const supabase = createAdminClient();

          await supabase
            .from("journal_entries")
            .update({ ai_feedback: text })
            .eq("id", entry_id)
            .eq("user_id", userId);
        }
      },
      onError({ error }) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logApiError(provider, errorMessage);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error en journal feedback:", error);

    return new Response(
      JSON.stringify({ error: "Error procesando la solicitud" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
