import Groq from "groq-sdk";

export function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn("GROQ_API_KEY no esta configurado");
    return null;
  }

  return new Groq({ apiKey });
}

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export const MAX_TOKENS = 1024;
export const TEMPERATURE = 0.3;