import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

interface AuthGuardProps {
  children: React.ReactNode;
}

export async function AuthGuard({ children }: AuthGuardProps) {
  const session = await getSession();

  if (!session.user_id) {
    redirect("/login");
  }

  if (session.subscription_status === "inactive") {
    redirect("/access-expired");
  }

  return <>{children}</>;
}