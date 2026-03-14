import { getGroqClient, GROQ_MODEL, MAX_TOKENS, TEMPERATURE } from "./groq";
import { getOpenAIClient, OPENAI_MODEL, OPENAI_MAX_TOKENS, OPENAI_TEMPERATURE } from "./openai";
import { shouldUseFallback, logApiError } from "./circuit-breaker";

export type AIProvider = "groq" | "openai";

export interface AIResponse {
  content: string;
  provider: AIProvider;
}

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<AIResponse | null> {
  const useFallback = await shouldUseFallback();

  if (!useFallback) {
    const groqClient = getGroqClient();

    if (groqClient) {
      try {
        const completion = await groqClient.chat.completions.create({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: MAX_TOKENS,
          temperature: TEMPERATURE,
        });

        const content = completion.choices[0]?.message?.content;

        if (content) {
          return {
            content,
            provider: "groq",
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown Groq error";
        await logApiError("groq", errorMessage);
        console.error("Error con Groq, intentando OpenAI fallback:", error);
      }
    }
  }

  const openaiClient = getOpenAIClient();

  if (openaiClient) {
    try {
      const completion = await openaiClient.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: OPENAI_MAX_TOKENS,
        temperature: OPENAI_TEMPERATURE,
      });

      const content = completion.choices[0]?.message?.content;

      if (content) {
        return {
          content,
          provider: "openai",
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown OpenAI error";
      await logApiError("openai", errorMessage);
      console.error("Error con OpenAI fallback:", error);
    }
  }

  return null;
}