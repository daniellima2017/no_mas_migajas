import { createClient } from "@supabase/supabase-js";

// Restrito apenas para webhooks e operacoes de backend.
// NUNCA exponha este client no frontend.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}