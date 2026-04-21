"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BookOpen, MessageSquare, LineChart, User } from "lucide-react";

interface TabItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isFAB?: boolean;
}

const TABS: TabItem[] = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/progress", icon: LineChart, label: "Progreso" },
  { href: "/simulator", icon: MessageSquare, label: "Simulador", isFAB: true },
  { href: "/journal", icon: BookOpen, label: "Diario" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="border-t"
        style={{
          background: "rgba(10, 10, 15, 0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: "rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
          {TABS.map((tab) => {
            const isActive =
              pathname === tab.href ||
              (tab.href === "/progress" && pathname === "/achievements");
            const IconComponent = tab.icon;

            if (tab.isFAB) {
              return (
                <Link key={tab.href} href={tab.href} className="relative -mt-6">
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "rgba(185, 28, 28, 0.3)",
                    }}
                    animate={{
                      scale: [1, 1.6],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #7F1D1D 100%)",
                      boxShadow: "0 0 25px rgba(185, 28, 28, 0.5), 0 0 50px rgba(185, 28, 28, 0.2)",
                      border: "1px solid rgba(239, 68, 68, 0.4)",
                    }}
                  >
                    <IconComponent className="w-6 h-6 text-white relative z-10" />
                  </motion.div>
                </Link>
              );
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center py-2 touch-manipulation"
              >
                <motion.div whileTap={{ scale: 0.85 }} className="relative p-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isActive ? "active" : "inactive"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <IconComponent
                        className={`w-5 h-5 transition-colors duration-200 ${
                          isActive ? "text-accent-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]" : "text-zinc-500"
                        }`}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-gold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        style={{ boxShadow: "0 0 8px rgba(212, 175, 55, 0.6)" }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                <span
                  className={`text-[10px] font-semibold tracking-[0.1em] uppercase ${
                    isActive ? "text-accent-gold" : "text-zinc-600"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
