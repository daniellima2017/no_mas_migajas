import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/email/resend";
import crypto from "crypto";

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "";
  const bytes = crypto.randomBytes(10);
  for (let i = 0; i < 10; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "El email es requerido" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

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

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, subscription_status")
      .eq("email", normalizedEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "No existe una cuenta con ese correo electronico" },
        { status: 404 }
      );
    }

    if (user.subscription_status === "inactive") {
      return NextResponse.json(
        { error: "Tu suscripcion no esta activa. Contacta a soporte." },
        { status: 403 }
      );
    }

    const newPassword = generateTempPassword();

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      return NextResponse.json(
        { error: "Error al restablecer la contrasena" },
        { status: 500 }
      );
    }

    const emailSent = await sendPasswordResetEmail({
      email: normalizedEmail,
      password: newPassword,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: "Error al enviar el correo. Intenta nuevamente." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Se envio una nueva contrasena a tu correo electronico" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
