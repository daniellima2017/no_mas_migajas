"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  AlertTriangle,
  ClipboardList,
  Lock,
  Clock,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  Brain,
  Activity,
  BookOpen,
  MessageSquareWarning,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Fingerprint,
  History,
  CalendarDays,
  Target,
} from "lucide-react";
import { LevelBadge } from "@/components/dashboard/LevelBadge";
import { StreakTimer } from "@/components/dashboard/StreakTimer";
import { StreakProgressBar } from "@/components/streak/StreakProgressBar";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { NextMedalCard } from "@/components/dashboard/NextMedalCard";
import { ReinforcementFeed } from "@/components/dashboard/ReinforcementFeed";
import { ResetModal } from "@/components/streak/ResetModal";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { Flame, BarChart3, MessageSquare, Trophy } from "lucide-react";
import type {
  Streak,
  Medal,
  Relapse,
  TriggerPatterns,
  QuizResult,
  MonitoringSnapshot,
  MonitoringDailyState,
} from "@/types";

interface DashboardData {
  viewerId: string;
  streak: Streak | null;
  medals: Medal[];
  relapses: Relapse[];
  triggerPatterns: TriggerPatterns | null;
  quizResult: QuizResult | null;
  lastQuizAt: string | null;
  monitoring: MonitoringSnapshot;
  missionCompletedAt: string | null;
  monitoringHistory: MonitoringDailyState[];
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
  const [missionCompletedAt, setMissionCompletedAt] = useState<string | null>(null);
  const [missionJustCompleted, setMissionJustCompleted] = useState(false);

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
    setMissionCompletedAt(data?.missionCompletedAt || null);
  }, [data?.missionCompletedAt]);

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

  const handleCompleteMission = useCallback(() => {
    if (!data?.monitoring || missionCompletedAt) return;

    void (async () => {
      try {
        const response = await fetch("/api/monitoring/mission", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            missionDate: data.monitoring.mission_date,
            missionKey: data.monitoring.mission_key,
            vulnerability: data.monitoring.vulnerability,
            riskPercent: data.monitoring.risk_percent,
            patternLabel: data.monitoring.pattern_label,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setToastError(errorData.error || "No se pudo registrar la mision");
          return;
        }

        const result = (await response.json()) as { missionCompletedAt?: string | null };
        setMissionCompletedAt(result.missionCompletedAt || new Date().toISOString());
        setMissionJustCompleted(true);
        window.setTimeout(() => setMissionJustCompleted(false), 5000);
        await fetchDashboard();
      } catch {
        setToastError("Error de conexión al registrar la mision");
      }
    })();
  }, [data, missionCompletedAt, fetchDashboard]);

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
  const monitoring = data?.monitoring;

  if (!monitoring) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-accent-red mx-auto mb-4" />
          <p className="text-white font-bold text-lg mb-2">Monitoreo no disponible</p>
          <p className="text-zinc-400 text-sm mb-6">
            No pudimos construir tu estado actual. Intenta recargar.
          </p>
          <button onClick={fetchDashboard} className="btn-premium px-8 py-3 rounded-xl text-sm">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const riskTone =
    monitoring.vulnerability === "Alta"
      ? {
          text: "text-red-400",
          border: "rgba(248, 113, 113, 0.28)",
          bg: "rgba(248, 113, 113, 0.08)",
          glow: "0 0 30px rgba(248, 113, 113, 0.08)",
        }
      : monitoring.vulnerability === "Media"
      ? {
          text: "text-amber-400",
          border: "rgba(251, 191, 36, 0.24)",
          bg: "rgba(251, 191, 36, 0.08)",
          glow: "0 0 30px rgba(251, 191, 36, 0.08)",
        }
      : {
          text: "text-emerald-400",
          border: "rgba(52, 211, 153, 0.24)",
          bg: "rgba(52, 211, 153, 0.08)",
          glow: "0 0 30px rgba(52, 211, 153, 0.08)",
        };

  const victoryMessage = missionCompletedAt
    ? monitoring.mission_completion_message
    : monitoring.victory_body;
  const identityMessage = missionCompletedAt
    ? `${monitoring.identity_message} ${monitoring.behavior_proof}`
    : monitoring.identity_message;
  const continuityRecord =
    data?.monitoringHistory.find((entry) => entry.state_date !== monitoring.mission_date) || null;
  const continuityTitle = continuityRecord
    ? continuityRecord.risk_percent > monitoring.risk_percent
      ? "Hoy llegaste con mas control que en tu ultimo registro"
      : continuityRecord.risk_percent < monitoring.risk_percent
      ? "Hoy necesitas mas proteccion que en tu ultimo registro"
      : "Hoy repites el mismo frente que en tu ultimo registro"
    : "Hoy empieza el registro de tu proceso";
  const continuityMessage = continuityRecord
    ? continuityRecord.risk_percent > monitoring.risk_percent
      ? `La ultima vez estabas en ${continuityRecord.risk_percent}% de riesgo con ${continuityRecord.pattern_label.toLowerCase()}. Hoy tu sistema sigue atento, pero ya llega con menos carga.`
      : continuityRecord.risk_percent < monitoring.risk_percent
      ? `La ultima vez estabas en ${continuityRecord.risk_percent}% de riesgo. Hoy subiste a ${monitoring.risk_percent}% y conviene tratar este momento como una fase delicada, no como una recaida inevitable.`
      : `Tu riesgo sigue en una zona parecida a la ultima vez y el patron dominante vuelve a aparecer. Eso no es fracaso: es una señal de que el proceso sigue abierto y necesita continuidad.`
    : "A partir de hoy el sistema empezara a recordar como llegas cada dia para mostrarte si avanzas, te estabilizas o entras en una zona mas vulnerable.";
  const continuityEvidence = continuityRecord
    ? continuityRecord.mission_completed_at
      ? "Ayer dejaste una accion registrada. Hoy el objetivo es sostener esa linea, no empezar de cero."
      : "Ayer no quedo una victoria marcada. Hoy importa mas construir una prueba pequena que buscar hacerlo perfecto."
    : "Todavia no hay un dia anterior para comparar. La primera evidencia empieza con lo que hagas hoy.";

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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-5 md:p-6 space-y-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 40%, rgba(212, 175, 55, 0.04) 100%)",
            border: `1px solid ${riskTone.border}`,
            boxShadow: riskTone.glow,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                monitoring.vulnerability === "Alta"
                  ? "radial-gradient(circle at top right, rgba(248, 113, 113, 0.12), transparent 45%)"
                  : monitoring.vulnerability === "Media"
                  ? "radial-gradient(circle at top right, rgba(251, 191, 36, 0.12), transparent 45%)"
                  : "radial-gradient(circle at top right, rgba(52, 211, 153, 0.12), transparent 45%)",
            }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-semibold">
                Estado actual
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Hoy no es un dia neutro para ti.
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                {monitoring.pattern_description}
              </p>
            </div>

            <div
              className="rounded-2xl px-3 py-2 text-right flex-shrink-0"
              style={{
                background: riskTone.bg,
                border: `1px solid ${riskTone.border}`,
              }}
            >
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Vulnerabilidad</p>
              <p className={`text-lg font-bold ${riskTone.text}`}>{monitoring.vulnerability}</p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4">
            <div
              className="rounded-2xl p-4 md:p-5 space-y-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent-gold" />
                <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-semibold">
                  Lectura del sistema
                </p>
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed">
                {monitoring.projected_behavior}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${riskTone.text}`}
                  style={{ background: riskTone.bg }}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Riesgo actual: {monitoring.risk_percent}%
                </span>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-zinc-300 bg-white/5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
                  Patron dominante: {monitoring.pattern_label}
                </span>
              </div>
              <p className="text-zinc-500 text-xs">{monitoring.signal_summary}</p>
            </div>

            <div
              className="rounded-2xl p-4 md:p-5 space-y-3"
              style={{
                background: "linear-gradient(145deg, rgba(212,175,55,0.08), rgba(255,255,255,0.02))",
                border: "1px solid rgba(212, 175, 55, 0.16)",
              }}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent-gold" />
                <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-semibold">
                  Mision del dia
                </p>
              </div>
              <p className="text-white font-semibold text-sm md:text-base">
                {monitoring.mission_title}
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {monitoring.mission_body}
              </p>
              <div className="pt-1">
                {missionCompletedAt ? (
                  <div
                    className="rounded-xl px-3 py-2"
                    style={{
                      background: "rgba(52, 211, 153, 0.08)",
                      border: "1px solid rgba(52, 211, 153, 0.18)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-[0.18em]">
                          Mision registrada
                        </p>
                        <p className="text-zinc-200 text-xs leading-relaxed">
                          {monitoring.mission_completion_message}
                        </p>
                        <p className="text-zinc-500 text-[11px]">
                          Completada hoy a las{" "}
                          {new Date(missionCompletedAt).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleCompleteMission}
                    className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#fff",
                    }}
                  >
                    Marcar como hecha
                  </button>
                )}
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                {monitoring.support_message}
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => router.push("/simulator")}
              className="btn-premium w-full px-5 py-4 rounded-2xl flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5" />
                Estoy por escribirle
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => router.push("/journal")}
              className="w-full px-5 py-4 rounded-2xl flex items-center justify-between gap-3 text-white transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-gold" />
                Necesito descargarme
              </span>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="rounded-2xl p-4 md:p-5 space-y-4"
          style={{
            background: "linear-gradient(145deg, rgba(212,175,55,0.06), rgba(255,255,255,0.03))",
            border: "1px solid rgba(212,175,55,0.14)",
          }}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-accent-gold" />
              <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-semibold">
                Primera semana
              </p>
            </div>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold text-accent-gold bg-[rgba(212,175,55,0.08)]">
              Dia {monitoring.journey_day} de 7
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-white font-semibold text-sm md:text-base">{monitoring.journey_title}</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{monitoring.journey_message}</p>
          </div>

          <div
            className="rounded-xl px-3 py-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-zinc-300 text-xs font-semibold uppercase tracking-[0.18em]">
                  {monitoring.journey_focus_title}
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed">{monitoring.journey_focus_body}</p>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Fase actual: {monitoring.journey_phase}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-4 md:p-5 space-y-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-accent-gold" />
            <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-semibold">
              Continuidad del proceso
            </p>
          </div>
          <p className="text-white font-semibold text-sm md:text-base">{continuityTitle}</p>
          <p className="text-zinc-300 text-sm leading-relaxed">{continuityMessage}</p>
          <div
            className="rounded-xl px-3 py-2"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-zinc-500 text-[11px] uppercase tracking-[0.18em] font-semibold mb-1">
              Lo que arrastras hacia hoy
            </p>
            <p className="text-zinc-400 text-xs leading-relaxed">{continuityEvidence}</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="text-center py-1"
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
          transition={{ delay: 0.26 }}
          className="px-2"
        >
          <StreakProgressBar currentSeconds={streakSeconds} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.29 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <ScoreCard quizResult={data?.quizResult ?? null} />
          <NextMedalCard streakSeconds={streakSeconds} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          <ReinforcementFeed streakSeconds={streakSeconds} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_auto] gap-4 items-stretch"
        >
          <div
            className="rounded-2xl p-4 md:p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent-gold" />
                  <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-semibold">
                    Victoria observable
                  </p>
                </div>
                <p className="text-white font-semibold text-sm md:text-base leading-relaxed">
                  {monitoring.victory_title}
                </p>
                <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                  {victoryMessage}
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed">{monitoring.behavior_proof}</p>
              </div>

              <button
                onClick={() => setShowResetModal(true)}
                className="px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 text-white flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 59, 48, 0.15) 0%, rgba(255, 59, 48, 0.08) 100%)",
                  border: "2px solid rgba(255, 59, 48, 0.35)",
                  boxShadow: "0 4px 20px rgba(255, 59, 48, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent-red" />
                  <span className="text-accent-red">Recaida</span>
                </span>
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl p-4 md:p-5 space-y-3"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(212,175,55,0.04))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-accent-gold" />
              <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] font-semibold">
                Identidad en cambio
              </p>
            </div>
            <p className="text-white font-semibold text-sm md:text-base">{monitoring.identity_title}</p>
            <p className="text-zinc-300 text-sm leading-relaxed">{identityMessage}</p>
            <div
              className="rounded-xl px-3 py-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-zinc-300 text-xs font-semibold uppercase tracking-[0.18em]">
                    Evidencia de cambio
                  </p>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {missionCompletedAt
                      ? "Hoy ya dejaste una prueba concreta de control sobre tu patron."
                      : "Tu cambio empieza a verse cuando sostienes una pausa, no solo cuando entiendes lo que sientes."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {quizCooldown > 0 ? (
            <div
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-medium"
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
            </div>
          ) : (
            <button
              onClick={() => router.push("/quiz?retake")}
              className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300"
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

      <OnboardingTour
        tourKey="dashboard"
        steps={[
          {
            icon: <Flame className="w-7 h-7 text-accent-gold" />,
            title: "Tu Racha de Dignidad",
            description: "Este contador mide cuanto tiempo llevas sin buscar migajas de atencion. Cada segundo suma. Cada recaida lo reinicia.",
          },
          {
            icon: <BarChart3 className="w-7 h-7 text-accent-gold" />,
            title: "Tu Puntuacion",
            description: "Tu score refleja tu nivel de dependencia emocional. Rehaz el cuestionario cada 24 horas para ver tu progreso real.",
          },
          {
            icon: <Trophy className="w-7 h-7 text-accent-gold" />,
            title: "Medallas y Niveles",
            description: "Desbloquea medallas al mantener tu racha. Cada nivel demuestra que estas recuperando tu poder.",
          },
          {
            icon: <MessageSquare className="w-7 h-7 text-accent-gold" />,
            title: "Simulador Hielo Seco",
            description: "Usa el boton rojo del menu para analizar mensajes. Te traduce lo que el REALMENTE quiere decir.",
          },
        ]}
      />

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

      {missionJustCompleted && missionCompletedAt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-xl p-4 z-50"
          style={{
            background: "rgba(52, 211, 153, 0.1)",
            border: "1px solid rgba(52, 211, 153, 0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-emerald-400 text-sm font-semibold">Mision completada</p>
                <p className="text-zinc-200 text-xs leading-relaxed">
                  {monitoring.mission_completion_message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setMissionJustCompleted(false)}
              className="text-emerald-400/60 hover:text-emerald-400 text-xs"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
