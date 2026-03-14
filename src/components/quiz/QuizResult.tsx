"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import type { QuizResult as QuizResultType } from "@/lib/scoring/quiz-algorithm";

interface QuizResultProps {
  result: QuizResultType;
}

const colorConfig = {
  green: {
    border: "rgba(34, 197, 94, 0.3)",
    bg: "rgba(34, 197, 94, 0.08)",
    glow: "0 0 30px rgba(34, 197, 94, 0.15)",
    text: "text-green-400",
    iconBg: "rgba(34, 197, 94, 0.15)",
    Icon: CheckCircle,
  },
  yellow: {
    border: "rgba(234, 179, 8, 0.3)",
    bg: "rgba(234, 179, 8, 0.08)",
    glow: "0 0 30px rgba(234, 179, 8, 0.15)",
    text: "text-yellow-400",
    iconBg: "rgba(234, 179, 8, 0.15)",
    Icon: AlertTriangle,
  },
  orange: {
    border: "rgba(249, 115, 22, 0.3)",
    bg: "rgba(249, 115, 22, 0.08)",
    glow: "0 0 30px rgba(249, 115, 22, 0.15)",
    text: "text-orange-400",
    iconBg: "rgba(249, 115, 22, 0.15)",
    Icon: AlertCircle,
  },
  red: {
    border: "rgba(239, 68, 68, 0.3)",
    bg: "rgba(239, 68, 68, 0.08)",
    glow: "0 0 30px rgba(239, 68, 68, 0.15)",
    text: "text-red-400",
    iconBg: "rgba(239, 68, 68, 0.15)",
    Icon: XCircle,
  },
};

export function QuizResult({ result }: QuizResultProps) {
  const router = useRouter();
  const config = colorConfig[result.color];
  const IconComponent = config.Icon;

  const handleNavigate = () => {
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: config.iconBg,
              border: `2px solid ${config.border}`,
              boxShadow: config.glow,
            }}
          >
            <IconComponent className={`w-8 h-8 ${config.text}`} />
          </div>
        </div>

        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] font-semibold">
          Indice de Migajas
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <p
          className={`text-8xl md:text-9xl font-bold font-mono ${config.text}`}
          style={{ textShadow: `0 0 40px ${config.bg}` }}
        >
          {result.score}%
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center p-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${config.bg} 0%, rgba(255,255,255,0.02) 100%)`,
          border: `1px solid ${config.border}`,
          boxShadow: config.glow,
        }}
      >
        <p className="text-white text-xl md:text-2xl font-bold mb-2">
          {result.level}
        </p>
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
          {result.verdict}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center space-y-4"
      >
        <div
          className="rounded-2xl p-4"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-zinc-500 text-xs uppercase tracking-[0.15em] font-medium mb-2">
            Puntos brutos
          </p>
          <p className="text-white text-2xl font-mono font-semibold">
            {result.rawPoints} <span className="text-zinc-600">/ 150</span>
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex justify-center pt-4"
      >
        <button
          onClick={handleNavigate}
          className="btn-premium px-8 py-3.5 text-base flex items-center gap-2"
        >
          Ir al Dashboard
          <ArrowRight className="h-5 w-5" />
        </button>
      </motion.div>
    </div>
  );
}
