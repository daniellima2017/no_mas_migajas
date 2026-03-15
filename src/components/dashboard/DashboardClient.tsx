"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertTriangle, ClipboardList, Lock, Clock, ChevronDown } from "lucide-react";
import { LevelBadge } from "@/components/dashboard/LevelBadge";
import { StreakTimer } from "@/components/dashboard/StreakTimer";
import { StreakProgressBar } from "@/components/streak/StreakProgressBar";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { NextMedalCard } from "@/components/dashboard/NextMedalCard";
import { ReinforcementFeed } from "@/components/dashboard/ReinforcementFeed";
import { ResetModal } from "@/components/streak/ResetModal";
import type { Streak, Medal, Relapse, TriggerPatterns, QuizResult } from "@/types";

interface DashboardData {
  streak: Streak | null;
  medals: Medal[];
  relapses: Relapse[];
  triggerPatterns: TriggerPatterns | null;
  quizResult: QuizResult | null;
  lastQuizAt: string | null;
}

const QUIZ_COOLDOWN_MS = 24 * 60 * 60 * 1000;

function getQuizCooldownRemaining(lastQuizAt: string | null): number {
  if (!lastQuizAt) return 0;
  const elapsed = Date.now() - new Date(lastQuizAt).getTime();
  return Math.max(0, QUIZ_COOLDOWN_MS - elapsed);
}

function formatCooldown(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function DashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [quizCooldown, setQuizCooldown] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((userData) => {
        if (!userData.onboarding_completed) {
          router.push("/quiz");
        }
      })
      .catch(() => {});
  }, [router]);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) throw new Error("Error al cargar el dashboard");
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch {
      setError("No se pudo cargar el dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (!data?.lastQuizAt) return;
    const update = () => setQuizCooldown(getQuizCooldownRemaining(data.lastQuizAt));
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [data?.lastQuizAt]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollHint(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleResetSubmit = useCallback(
    async (formData: { reason: string; cravingLevel: number }) => {
      try {
        const response = await fetch("/api/streak/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: formData.reason, cravingLevel: formData.cravingLevel }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setToastError(errorData.error || "Error al registrar la recaida");
          return;
        }

        setShowResetModal(false);
        await fetchDashboard();
      } catch {
        setToastError("Error de conexión al registrar la recaida");
      }
    },
    [fetchDashboard]
  );

  const calculateStreakSeconds = (): number => {
    if (!data?.streak?.started_at) return 0;
    const start = new Date(data.streak.started_at).getTime();
    return Math.max(0, Math.floor((Date.now() - start) / 1000));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full glow-gold flex items-center justify-center border border-accent-gold/20">
            <RefreshCw className="w-6 h-6 text-accent-gold animate-spin" />
          </div>
          <p className="text-zinc-500 text-sm tracking-wide">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-accent-red mx-auto mb-4" />
          <p className="text-white font-bold text-lg mb-2">Error al cargar</p>
          <p className="text-zinc-400 text-sm mb-6">{error}</p>
          <button onClick={fetchDashboard} className="btn-premium px-8 py-3 rounded-xl text-sm">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const streakSeconds = calculateStreakSeconds();

  return (
    <div className="min-h-screen bg-bg-primary relative">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-8 pb-28">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-6"
        >
          <LevelBadge streakSeconds={streakSeconds} />
        </motion.header>

        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center py-4"
        >
          {data?.streak ? (
            <StreakTimer startedAt={data.streak.started_at} />
          ) : (
            <div className="py-8">
              <p className="text-zinc-400 text-sm">Sin streak activo</p>
            </div>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-2"
        >
          <StreakProgressBar currentSeconds={streakSeconds} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex justify-center"
        >
          <button
            onClick={() => setShowResetModal(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-accent-red"
            style={{
              background: "rgba(255, 59, 48, 0.06)",
              border: "1px solid rgba(255, 59, 48, 0.2)",
            }}
          >
            Registrar una recaida
          </button>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <ScoreCard quizResult={data?.quizResult ?? null} />
          <NextMedalCard streakSeconds={streakSeconds} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex justify-center"
        >
          {quizCooldown > 0 ? (
            <button
              disabled
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium cursor-not-allowed"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Lock className="w-4 h-4 text-zinc-600" />
              <span className="text-zinc-500">Rehacer cuestionario</span>
              <span className="flex items-center gap-1 text-xs text-zinc-600">
                <Clock className="w-3 h-3" />
                {formatCooldown(quizCooldown)}
              </span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/quiz?retake")}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300"
              style={{
                background: "rgba(212, 175, 55, 0.06)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
              }}
            >
              <ClipboardList className="w-4 h-4 text-accent-gold" />
              <span className="text-accent-gold">Rehacer cuestionario</span>
            </button>
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ReinforcementFeed streakSeconds={streakSeconds} />
        </motion.section>
      </div>

      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed bottom-20 left-0 right-0 lg:bottom-4 flex flex-col items-center pointer-events-none z-40"
          >
            <div
              className="px-4 py-1.5 rounded-full flex items-center gap-1.5 mb-1"
              style={{
                background: "rgba(10, 10, 15, 0.85)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-[10px] font-medium uppercase tracking-widest text-accent-gold/70">
                Desliza para ver mas
              </span>
            </div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-accent-gold/50" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showResetModal && (
        <ResetModal
          open={showResetModal}
          onOpenChange={setShowResetModal}
          onSubmit={handleResetSubmit}
        />
      )}

      {toastError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-xl p-4 z-50"
          style={{
            background: "rgba(255, 59, 48, 0.1)",
            border: "1px solid rgba(255, 59, 48, 0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-red-400 text-sm">{toastError}</p>
            <button
              onClick={() => setToastError(null)}
              className="text-red-400/60 hover:text-red-400 text-xs"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
