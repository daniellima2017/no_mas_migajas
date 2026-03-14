"use client";

import { TrendingUp, Award } from "lucide-react";
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

const colorConfig: Record<ScoreColor, { text: string; border: string; glow: string }> = {
  green: { text: "text-emerald-400", border: "rgba(52, 211, 153, 0.3)", glow: "rgba(52, 211, 153, 0.1)" },
  yellow: { text: "text-yellow-400", border: "rgba(250, 204, 21, 0.3)", glow: "rgba(250, 204, 21, 0.1)" },
  orange: { text: "text-orange-400", border: "rgba(251, 146, 60, 0.3)", glow: "rgba(251, 146, 60, 0.1)" },
  red: { text: "text-red-400", border: "rgba(248, 113, 113, 0.3)", glow: "rgba(248, 113, 113, 0.1)" },
};

export function ScoreCard({ quizResult }: ScoreCardProps) {
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

  return (
    <div
      className="glass-card-hover p-4"
      style={{
        borderColor: config.border,
        boxShadow: `0 0 20px ${config.glow}`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${config.glow}` }}
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
        <div className="text-right max-w-[40%]">
          <p className={`text-[11px] font-medium ${config.text} leading-tight line-clamp-2`}>
            {quizResult.verdict.length > 50 ? quizResult.verdict.substring(0, 50) + "..." : quizResult.verdict}
          </p>
        </div>
      </div>
    </div>
  );
}
