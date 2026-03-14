import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: "Sesion cerrada correctamente" },
      { status: 200 }
    );

    const session = await getIronSession<SessionData>(request, response, sessionOptions);
    session.destroy();

    return response;
  } catch {
    return NextResponse.json(
      { error: "Error al cerrar sesion" },
      { status: 500 }
    );
  }
}
