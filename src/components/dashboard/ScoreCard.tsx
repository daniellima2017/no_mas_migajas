"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Award, X, AlertTriangle, CheckCircle, AlertCircle, XCircle, ChevronRight } from "lucide-react";
import type { QuizResult } from "@/types";

interface ScoreCardProps {
  quizResult: QuizResult | null;
}

type ScoreColor = "green" | "yellow" | "orange" | "red";

function getScoreColor(score: number): ScoreColor {
  if (score <= 23) return "green";
  if (score <= 50) return "yellow";
  if (score <= 77) return "orange";
  return "red";
}

function getLevel(score: number): string {
  if (score <= 23) return "Dignidad Estable";
  if (score <= 50) return "Alerta de Desequilibrio";
  if (score <= 77) return "Zona de Migajas";
  return "Mendicidad Emocional";
}

const colorConfig: Record<ScoreColor, { text: string; border: string; glow: string; bg: string; iconBg: string }> = {
  green: { text: "text-emerald-400", border: "rgba(52, 211, 153, 0.3)", glow: "rgba(52, 211, 153, 0.1)", bg: "rgba(52, 211, 153, 0.08)", iconBg: "rgba(52, 211, 153, 0.15)" },
  yellow: { text: "text-yellow-400", border: "rgba(250, 204, 21, 0.3)", glow: "rgba(250, 204, 21, 0.1)", bg: "rgba(250, 204, 21, 0.08)", iconBg: "rgba(250, 204, 21, 0.15)" },
  orange: { text: "text-orange-400", border: "rgba(251, 146, 60, 0.3)", glow: "rgba(251, 146, 60, 0.1)", bg: "rgba(251, 146, 60, 0.08)", iconBg: "rgba(251, 146, 60, 0.15)" },
  red: { text: "text-red-400", border: "rgba(248, 113, 113, 0.3)", glow: "rgba(248, 113, 113, 0.1)", bg: "rgba(248, 113, 113, 0.08)", iconBg: "rgba(248, 113, 113, 0.15)" },
};

const IconMap: Record<ScoreColor, React.ComponentType<{ className?: string }>> = {
  green: CheckCircle,
  yellow: AlertTriangle,
  orange: AlertCircle,
  red: XCircle,
};

export function ScoreCard({ quizResult }: ScoreCardProps) {
  const [showModal, setShowModal] = useState(false);

  if (!quizResult) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
            <Award className="w-5 h-5 text-zinc-500" />
          </div>
          <div>
            <p className="text-zinc-500 text-[11px] uppercase tracking-wider font-medium">Indice de Migajas</p>
            <p className="text-zinc-400 text-sm mt-0.5">Sin diagnosticar</p>
          </div>
        </div>
      </div>
    );
  }

  const color = getScoreColor(quizResult.score);
  const config = colorConfig[color];
  const level = getLevel(quizResult.score);
  const StatusIcon = IconMap[color];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="glass-card-hover p-4 w-full text-left transition-all duration-200 active:scale-[0.98]"
        style={{
          borderColor: config.border,
          boxShadow: `0 0 20px ${config.glow}`,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: config.glow }}
            >
              <TrendingUp className={`w-5 h-5 ${config.text}`} />
            </div>
            <div>
              <p className="text-zinc-500 text-[11px] uppercase tracking-wider font-medium">
                Indice de Migajas
              </p>
              <p className={`text-xl font-bold font-mono mt-0.5 ${config.text}`}>
                {quizResult.score}%
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 ${config.text} opacity-50`} />
        </div>
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            style={{ background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(6px)" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm rounded-2xl p-6 space-y-6"
              style={{
                background: "linear-gradient(135deg, rgba(20, 20, 25, 0.98), rgba(15, 15, 20, 0.98))",
                border: `1px solid ${config.border}`,
                boxShadow: `0 0 40px ${config.glow}, 0 20px 60px rgba(0, 0, 0, 0.5)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Tu Diagnostico
                </span>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: config.iconBg,
                    border: `2px solid ${config.border}`,
                    boxShadow: `0 0 25px ${config.glow}`,
                  }}
                >
                  <StatusIcon className={`w-7 h-7 ${config.text}`} />
                </div>

                <p
                  className={`text-6xl font-bold font-mono ${config.text}`}
                  style={{ textShadow: `0 0 30px ${config.bg}` }}
                >
                  {quizResult.score}%
                </p>

                <p className={`text-sm font-bold ${config.text}`}>
                  {level}
                </p>
              </div>

              <div
                className="rounded-xl p-4"
                style={{
                  background: `linear-gradient(135deg, ${config.bg} 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${config.border}`,
                }}
              >
                <p className="text-zinc-300 text-sm leading-relaxed text-center">
                  {quizResult.verdict}
                </p>
              </div>

              <div
                className="rounded-xl p-3 flex items-center justify-between"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-zinc-500 text-xs uppercase tracking-wider">Puntos brutos</span>
                <span className="text-white font-mono font-semibold">
                  {quizResult.raw_points} <span className="text-zinc-600">/ 150</span>
                </span>
              </div>

              <p className="text-zinc-600 text-[10px] text-center uppercase tracking-wider">
                Ultimo diagnostico: {new Date(quizResult.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
