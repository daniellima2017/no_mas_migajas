import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { createClient } from "@supabase/supabase-js";
import { SessionData, sessionOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contrasena son requeridos" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("onboarding_completed, subscription_status")
      .eq("id", authData.user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "Error al obtener datos del usuario" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Inicio de sesion exitoso",
        user: {
          id: authData.user.id,
          email: authData.user.email,
          onboarding_completed: userData.onboarding_completed,
          subscription_status: userData.subscription_status,
        }
      },
      { status: 200 }
    );

    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.user_id = authData.user.id;
    session.email = authData.user.email || email;
    session.onboarding_completed = userData.onboarding_completed;
    session.subscription_status = userData.subscription_status as "active" | "inactive";
    await session.save();

    return response;
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}