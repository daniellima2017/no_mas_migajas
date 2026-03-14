import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/auth/session";

const PANIC_RESPONSES = [
  "No respondas nada. El silencio es la respuesta mas fuerte.",
  "Apaga el telefono. No hay nada ahi que necesites ver.",
  "El no merece ni un segundo mas de tu atencion. Bloquea.",
  "Cada mensaje que lees te aleja de tu dignidad. Detente ahora.",
  "Su intencion es mantenerte enganchada. No le des ese poder.",
  "La urgencia que sientes es falsa. No es amor, es adiccion.",
];

const BLOCK_DURATION_MINUTES = 30;

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.user_id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const randomIndex = Math.floor(Math.random() * PANIC_RESPONSES.length);
    const defaultResponse = PANIC_RESPONSES[randomIndex];

    const blockedUntil = new Date();
    blockedUntil.setMinutes(blockedUntil.getMinutes() + BLOCK_DURATION_MINUTES);

    return NextResponse.json(
      {
        default_response: defaultResponse,
        blocked_until: blockedUntil.toISOString(),
        block_duration_minutes: BLOCK_DURATION_MINUTES,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en panic endpoint:", error);
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
