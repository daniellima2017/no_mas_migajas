import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyHotmartToken } from "@/lib/hotmart/verify";
import { sendWelcomeEmail } from "@/lib/email/resend";

interface HotmartPayload {
  id?: string;
  event?: string;
  data?: {
    buyer?: {
      email?: string;
      name?: string;
    };
    purchase?: {
      transaction?: string;
      status?: string;
    };
    subscription?: {
      status?: string;
    };
  };
}

export async function POST(request: Request) {
  try {
    const hottok = request.headers.get("x-hottok");

    if (!verifyHotmartToken(hottok)) {
      return NextResponse.json(
        { error: "Token invalido" },
        { status: 401 }
      );
    }

    const payload: HotmartPayload = await request.json();
    const eventId = payload.id;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID no proporcionado" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("event_id", eventId)
      .single();

    if (existingEvent) {
      return NextResponse.json(
        { message: "Evento ya procesado" },
        { status: 200 }
      );
    }

    const eventType = payload.event;
    const buyerEmail = payload.data?.buyer?.email;
    const buyerName = payload.data?.buyer?.name;
    const transactionId = payload.data?.purchase?.transaction;

    if (!buyerEmail) {
      return NextResponse.json(
        { error: "Email del comprador no proporcionado" },
        { status: 400 }
      );
    }

    const approvedEvents = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE", "approved", "complete"];
    const canceledEvents = ["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "PURCHASE_CANCELED", "refunded", "chargeback", "canceled"];

    if (approvedEvents.includes(eventType || "")) {
      const tempPassword = crypto.randomUUID().slice(0, 8);

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: buyerEmail,
        password: tempPassword,
        email_confirm: true,
      });

      if (authError) {
        console.error("Error creando usuario:", authError);
        
        await supabase.from("webhook_events").insert({
          event_id: eventId,
          event_type: eventType,
          payload: payload,
          processed_at: new Date().toISOString(),
        });

        return NextResponse.json(
          { error: "Error al crear usuario" },
          { status: 500 }
        );
      }

      if (authData.user) {
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: buyerEmail,
          name: buyerName || null,
          hotmart_transaction_id: transactionId || null,
          onboarding_completed: false,
          current_level: "novato",
          subscription_status: "active",
        });

        if (userError) {
          console.error("Error insertando en users:", userError);
        }

        await sendWelcomeEmail({
          email: buyerEmail,
          name: buyerName || null,
          password: tempPassword,
        });
      }

      await supabase.from("webhook_events").insert({
        event_id: eventId,
        event_type: eventType,
        payload: payload,
        processed_at: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          message: "Usuario creado exitosamente",
          user_id: authData.user?.id,
          temp_password: tempPassword,
        },
        { status: 200 }
      );
    }

    if (canceledEvents.includes(eventType || "")) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ subscription_status: "inactive" })
        .eq("email", buyerEmail);

      if (updateError) {
        console.error("Error actualizando suscripcion:", updateError);
      }

      await supabase.from("webhook_events").insert({
        event_id: eventId,
        event_type: eventType,
        payload: payload,
        processed_at: new Date().toISOString(),
      });

      return NextResponse.json(
        { message: "Suscripcion actualizada a inactiva" },
        { status: 200 }
      );
    }

    await supabase.from("webhook_events").insert({
      event_id: eventId,
      event_type: eventType,
      payload: payload,
      processed_at: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Evento registrado" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}