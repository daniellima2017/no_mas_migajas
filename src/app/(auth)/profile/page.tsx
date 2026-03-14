"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Trophy,
  MessageSquare,
  Calendar,
  LogOut,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { PasswordReset } from "@/components/auth/PasswordReset";

interface ProfileStats {
  email: string;
  longestStreakDays: number;
  totalSimulatorCalls: number;
  totalDaysActive: number;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-zinc-800 rounded mx-auto" />
      <div className="h-24 bg-zinc-800 rounded-xl" />
      <div className="h-48 bg-zinc-800 rounded-xl" />
      <div className="h-32 bg-zinc-800 rounded-xl" />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile");

      if (!response.ok) {
        throw new Error("Error al cargar el perfil");
      }

      const profileData = await response.json();
      setStats(profileData);
    } catch {
      setError("No se pudo cargar el perfil");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        setError("Error al cerrar sesion");
        setIsLoggingOut(false);
      }
    } catch {
      setError("Error al cerrar sesion");
      setIsLoggingOut(false);
    }
  }, [router]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-bg-card border border-border-danger rounded-lg p-6 max-w-md text-center">
          <AlertTriangle className="w-10 h-10 text-accent-red mx-auto mb-4" />
          <p className="text-white mb-2">Error al cargar</p>
          <p className="text-zinc-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        <header className="text-center pt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-bold text-white">Tu Perfil</h1>
            <p className="text-zinc-500 text-sm mt-1">Gestiona tu cuenta</p>
          </motion.div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-card border border-border-default rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-zinc-400" />
            <span className="text-zinc-500 text-xs uppercase tracking-wider">
              Correo electronico
            </span>
          </div>
          <p className="text-white text-lg font-mono pl-8">
            {stats?.email || "Sin email"}
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-card border border-border-default rounded-xl p-6"
        >
          <h2 className="text-zinc-400 text-sm uppercase tracking-wider mb-4">
            Estadisticas
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-accent-gold" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {stats?.longestStreakDays || 0}
              </p>
              <p className="text-zinc-500 text-xs mt-1">Mayor racha</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {stats?.totalSimulatorCalls || 0}
              </p>
              <p className="text-zinc-500 text-xs mt-1">Analisis IA</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {stats?.totalDaysActive || 0}
              </p>
              <p className="text-zinc-500 text-xs mt-1">Dias activo</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-card border border-border-default rounded-xl p-6"
        >
          <h2 className="text-zinc-400 text-sm uppercase tracking-wider mb-4">
            Seguridad
          </h2>
          <PasswordReset />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-8"
        >
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-4 bg-bg-danger/20 border border-border-danger text-accent-red rounded-xl font-semibold hover:bg-bg-danger/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoggingOut ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Cerrando sesion...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Cerrar sesion
              </>
            )}
          </button>
        </motion.section>
      </div>
    </div>
  );
}