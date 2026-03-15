import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

interface AuthGuardProps {
  children: React.ReactNode;
  allowBeforeOnboarding?: boolean;
}

export async function AuthGuard({ children, allowBeforeOnboarding = false }: AuthGuardProps) {
  const session = await getSession();

  if (!session.user_id) {
    redirect("/login");
  }

  if (session.subscription_status === "inactive") {
    redirect("/access-expired");
  }

  if (!session.onboarding_completed && !allowBeforeOnboarding) {
    redirect("/quiz");
  }

  return <>{children}</>;
}