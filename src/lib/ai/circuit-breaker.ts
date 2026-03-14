import { createAdminClient } from "@/lib/supabase/admin";

const ERROR_THRESHOLD = 3;
const ERROR_WINDOW_MINUTES = 5;

interface ErrorCount {
  count: number;
}

export async function shouldUseFallback(): Promise<boolean> {
  const supabase = createAdminClient();

  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - ERROR_WINDOW_MINUTES);

  const { data, error } = await supabase
    .from("api_error_logs")
    .select("id", { count: "exact", head: false })
    .eq("provider", "groq")
    .gte("created_at", fiveMinutesAgo.toISOString());

  if (error) {
    console.error("Error consultando api_error_logs:", error);
    return false;
  }

  const errorCount = data?.length || 0;

  return errorCount >= ERROR_THRESHOLD;
}

export async function logApiError(
  provider: string,
  errorMessage: string
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("api_error_logs").insert({
    provider,
    error_message: errorMessage,
  });

  if (error) {
    console.error("Error registrando fallo en api_error_logs:", error);
  }
}

export async function getProviderHealth(): Promise<{
  groq: { healthy: boolean; errorCount: number };
  openai: { healthy: boolean; errorCount: number };
}> {
  const supabase = createAdminClient();

  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - ERROR_WINDOW_MINUTES);

  const { data: groqErrors } = await supabase
    .from("api_error_logs")
    .select("id")
    .eq("provider", "groq")
    .gte("created_at", fiveMinutesAgo.toISOString());

  const { data: openaiErrors } = await supabase
    .from("api_error_logs")
    .select("id")
    .eq("provider", "openai")
    .gte("created_at", fiveMinutesAgo.toISOString());

  const groqErrorCount = groqErrors?.length || 0;
  const openaiErrorCount = openaiErrors?.length || 0;

  return {
    groq: {
      healthy: groqErrorCount < ERROR_THRESHOLD,
      errorCount: groqErrorCount,
    },
    openai: {
      healthy: openaiErrorCount < ERROR_THRESHOLD,
      errorCount: openaiErrorCount,
    },
  };
}