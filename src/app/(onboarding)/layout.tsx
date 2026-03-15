import { AuthGuard } from "@/components/layout/AuthGuard";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowBeforeOnboarding>
      <main className="min-h-screen bg-bg-primary">
        {children}
      </main>
    </AuthGuard>
  );
}
