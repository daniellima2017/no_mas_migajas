import OpenAI from "openai";

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OPENAI_API_KEY no esta configurado");
    return null;
  }

  return new OpenAI({ apiKey });
}

export const OPENAI_MODEL = "gpt-4o-mini";

export const OPENAI_MAX_TOKENS = 1024;
export const OPENAI_TEMPERATURE = 0.3;