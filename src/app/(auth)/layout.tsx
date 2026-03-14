import { AuthGuard } from "@/components/layout/AuthGuard";
import { SidebarRail } from "@/components/layout/SidebarRail";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarRail />
      <main className="min-h-screen bg-bg-primary lg:ml-16 pb-20 lg:pb-0">
        {children}
      </main>
      <div className="lg:hidden">
        <BottomTabBar />
      </div>
    </AuthGuard>
  );
}