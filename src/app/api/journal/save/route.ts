import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { createAdminClient } from "@/lib/supabase/admin";
import { SessionData, sessionOptions } from "@/lib/auth/session";

interface JournalSaveRequest {
  content: string;
}

const MAX_CONTENT_LENGTH = 5000;

function sanitizeContent(content: string): string {
  return content
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

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

    const body: JournalSaveRequest = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Contenido requerido" },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return NextResponse.json(
        { error: "El contenido no puede estar vacio" },
        { status: 400 }
      );
    }

    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `El contenido excede el limite de ${MAX_CONTENT_LENGTH} caracteres` },
        { status: 400 }
      );
    }

    const sanitizedContent = sanitizeContent(trimmedContent);

    const supabase = createAdminClient();

    const { data, error: insertError } = await supabase
      .from("journal_entries")
      .insert({
        user_id: session.user_id,
        content: sanitizedContent,
      })
      .select("id, created_at")
      .single();

    if (insertError) {
      console.error("Error guardando entrada del diario:", insertError);
      return NextResponse.json(
        { error: "Error al guardar la entrada" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Entrada guardada",
        entry_id: data.id,
        created_at: data.created_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error procesando entrada del diario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
