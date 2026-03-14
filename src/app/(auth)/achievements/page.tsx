"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle, Trophy, BarChart3, History } from "lucide-react";
import { MedalGrid } from "@/components/achievements/MedalGrid";
import { TriggerChart } from "@/components/achievements/TriggerChart";
import { RelapseHistory } from "@/components/achievements/RelapseHistory";
import type { Medal, Relapse, TriggerPatterns } from "@/types";

interface AchievementsData {
  medals: Medal[];
  relapses: Relapse[];
  triggerPatterns: TriggerPatterns | null;
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
  const [data, setData] = useState<AchievementsData | null>(null);
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
        <header className="text-center pt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-accent-gold"
          >
            <Trophy className="w-6 h-6" />
            <h1 className="text-2xl font-bold text-white">Tus Victorias</h1>
          </motion.div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-card border border-border-default rounded-xl p-6"
        >
          <MedalGrid medals={data?.medals || []} />
        </motion.section>

        <header className="flex items-center gap-2 pt-4">
          <BarChart3 className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Analisis de Gatillos</h2>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-card border border-border-default rounded-xl p-6"
        >
          <TriggerChart
            relapses={data?.relapses || []}
            triggerPatterns={data?.triggerPatterns ?? null}
          />
        </motion.section>

        <header className="flex items-center gap-2 pt-4">
          <History className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Historial de Recaidas</h2>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pb-8"
        >
          <RelapseHistory
            relapses={data?.relapses || []}
            triggerPatterns={data?.triggerPatterns ?? null}
          />
        </motion.section>
      </div>
    </div>
  );
}