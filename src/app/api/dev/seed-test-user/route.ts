import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TEST_USER_EMAIL = "test@no-mas-migajas.test";
const TEST_USER_PASSWORD = "Test1234!";
const TEST_USER_NAME = "Usuario Prueba";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "No disponible en produccion" },
      { status: 403 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.DEV_SECRET_KEY || "dev-secret-12345"}`;

  if (authHeader !== expectedAuth) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const supabase = createAdminClient();

    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("Error listando usuarios:", listError);
    }

    if (existingUsers) {
      for (const user of existingUsers.users) {
        if (user.email === TEST_USER_EMAIL) {
          await supabase.auth.admin.deleteUser(user.id);
          
          await supabase.from("users").delete().eq("id", user.id);
          await supabase.from("streaks").delete().eq("user_id", user.id);
          await supabase.from("medals").delete().eq("user_id", user.id);
          await supabase.from("quiz_results").delete().eq("user_id", user.id);
          await supabase.from("relapses").delete().eq("user_id", user.id);
          await supabase.from("journal_entries").delete().eq("user_id", user.id);
          await supabase.from("trigger_patterns").delete().eq("user_id", user.id);
        }
      }
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Error al crear usuario de prueba", details: authError },
        { status: 500 }
      );
    }

    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: TEST_USER_EMAIL,
      name: TEST_USER_NAME,
      hotmart_transaction_id: "test-transaction-001",
      onboarding_completed: false,
      current_level: "novato",
      subscription_status: "active",
    });

    if (userError) {
      console.error("Error insertando en users:", userError);
    }

    const { error: streakError } = await supabase.from("streaks").insert({
      user_id: authData.user.id,
      started_at: new Date().toISOString(),
      longest_streak_seconds: 0,
      is_active: true,
    });

    if (streakError) {
      console.error("Error insertando streak:", streakError);
    }

    return NextResponse.json({
      message: "Usuario de prueba creado exitosamente",
      test_user: {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
        id: authData.user.id,
      },
      login_url: "/login",
    });
  } catch (error) {
    console.error("Error en seed-test-user:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "No disponible en produccion" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Endpoint para crear usuario de prueba",
    method: "POST",
    headers: {
      "Authorization": "Bearer <DEV_SECRET_KEY>",
    },
    test_credentials: {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    },
    note: "El usuario se crea con onboarding_completed=false para probar el flujo completo desde el quiz",
  });
}