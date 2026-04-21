"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, LineChart, ShieldCheck, Sparkles, UserCircle2 } from "lucide-react";
import { MedalGrid } from "@/components/achievements/MedalGrid";
import type { Medal } from "@/types";

interface ProgressData {
  medals: Medal[];
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-6 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-zinc-800 rounded" />
      <div className="h-32 bg-zinc-800 rounded-xl" />
      <div className="h-8 w-48 bg-zinc-800 rounded" />
      <div className="h-64 bg-zinc-800 rounded-xl" />
      <div className="h-8 w-48 bg-zinc-800 rounded" />
      <div className="h-48 bg-zinc-800 rounded-xl" />
    </div>
  );
}

export default function AchievementsPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/achievements");

      if (!response.ok) {
        throw new Error("Error al cargar logros");
      }

      const achievementsData = await response.json();
      setData(achievementsData);
    } catch {
      setError("No se pudieron cargar los logros");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-bg-card border border-border-danger rounded-lg p-6 max-w-md text-center">
          <AlertTriangle className="w-10 h-10 text-accent-red mx-auto mb-4" />
          <p className="text-white mb-2">Error al cargar</p>
          <p className="text-zinc-400 text-sm mb-4">{error}</p>
          <button
            onClick={fetchAchievements}
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
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-8">
        <header className="pt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4"
          >
            <div className="flex-1 text-center space-y-3">
              <div className="inline-flex items-center gap-2 text-accent-gold">
                <LineChart className="w-6 h-6" />
                <h1 className="text-2xl font-bold text-white">Tu Progreso</h1>
              </div>
              <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
                Aqui ves lo que ya estas sosteniendo: medallas, evidencia de avance y
                la parte del proceso que ya no depende solo de fuerza de voluntad.
              </p>
            </div>

            <Link
              href="/profile"
              className="rounded-2xl px-3 py-2 text-zinc-300 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="flex items-center gap-2 text-sm">
                <UserCircle2 className="w-4 h-4 text-accent-gold" />
                Perfil
              </span>
            </Link>
          </motion.div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-bg-card border border-border-default rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-accent-gold" />
              <h2 className="text-white font-semibold">Lo que ya estas sosteniendo</h2>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Cada medalla representa tiempo real en el que no obedeciste el mismo impulso.
              No es decoracion: es prueba de control acumulado.
            </p>
          </div>

          <Link
            href="/patterns"
            className="bg-bg-card border border-border-default rounded-xl p-6 transition-colors hover:border-accent-gold/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent-gold" />
              <h2 className="text-white font-semibold">Abrir patrones y recaidas</h2>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Tus gatillos, horarios y recaidas siguen disponibles, pero ahora viven
              en una vista aparte para que esta pantalla no pierda foco.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-accent-gold text-sm font-semibold">
              <span>Ir a patrones</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-bg-card border border-border-default rounded-xl p-6"
        >
          <MedalGrid medals={data?.medals || []} />
        </motion.section>
      </div>
    </div>
  );
}
