import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.user_id) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user_id: session.user_id,
    email: session.email,
    onboarding_completed: session.onboarding_completed,
    subscription_status: session.subscription_status,
  });
}
