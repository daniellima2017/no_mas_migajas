import { NextResponse } from "next/server";
import { shouldUseFallback, logApiError, getProviderHealth } from "@/lib/ai/circuit-breaker";

const TEST_SECRET = process.env.DEV_SECRET_KEY || "dev-secret-12345";

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "No disponible en produccion" },
      { status: 403 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${TEST_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const health = await getProviderHealth();
  const useFallback = await shouldUseFallback();

  return NextResponse.json({
    circuit_breaker: {
      use_fallback: useFallback,
      threshold: 3,
      window_minutes: 5,
    },
    providers: health,
    instructions: {
      simulate_error: "POST /api/dev/test-circuit-breaker con { action: 'simulate_error' }",
      check_status: "GET /api/dev/test-circuit-breaker (mostra status atual)",
      reset: "POST /api/dev/test-circuit-breaker con { action: 'reset' } - limpa logs de erro",
    },
  });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "No disponible en produccion" },
      { status: 403 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${TEST_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, count } = body;

    switch (action) {
      case "simulate_error": {
        const errorCount = count || 1;
        const errors = [];
        
        for (let i = 0; i < errorCount; i++) {
          await logApiError("groq", `Simulated Groq error #${i + 1}`);
          errors.push(i + 1);
        }

        const health = await getProviderHealth();
        const useFallback = await shouldUseFallback();

        return NextResponse.json({
          message: `${errorCount} erro(s) simulado(s) no Groq`,
          errors_registered: errors,
          circuit_breaker: {
            use_fallback: useFallback,
            groq_healthy: health.groq.healthy,
            groq_error_count: health.groq.errorCount,
          },
          next_step: useFallback 
            ? "Circuit breaker ATIVO - proximas chamadas usarao OpenAI"
            : `Faltam ${3 - health.groq.errorCount} erro(s) para ativar fallback`,
        });
      }

      case "reset": {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const supabase = createAdminClient();
        
        const { error } = await supabase
          .from("api_error_logs")
          .delete()
          .eq("provider", "groq");

        if (error) {
          return NextResponse.json({ error: "Erro ao limpar logs" }, { status: 500 });
        }

        return NextResponse.json({
          message: "Logs de erro do Groq limpos",
          circuit_breaker: {
            use_fallback: false,
            groq_healthy: true,
          },
        });
      }

      default:
        return NextResponse.json(
          { error: "Acao invalida. Use: simulate_error ou reset" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro no test-circuit-breaker:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}