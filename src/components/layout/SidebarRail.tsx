"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, MessageSquare, LineChart, BookOpen, Radar, User } from "lucide-react";

interface RailItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const RAIL_ITEMS: RailItem[] = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/progress", icon: LineChart, label: "Progreso" },
  { href: "/patterns", icon: Radar, label: "Patrones" },
  { href: "/simulator", icon: MessageSquare, label: "Simulador" },
  { href: "/journal", icon: BookOpen, label: "Diario" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export function SidebarRail() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 hidden lg:flex flex-col items-center py-6 w-16 bg-bg-primary border-r border-zinc-800/50">
      <div className="flex flex-col items-center gap-2 mt-16">
        {RAIL_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/progress" && pathname === "/achievements");
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  transition-colors duration-200
                  ${isActive ? "bg-zinc-800" : "hover:bg-zinc-800/50"}
                `}
              >
                <IconComponent
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-zinc-500"
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeRail"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent-gold rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
