"use client";

import { motion } from "framer-motion";
import { User, Shield, Sword, Crown, Sparkles } from "lucide-react";

interface LevelBadgeProps {
  streakSeconds: number;
}

interface LevelConfig {
  name: string;
  minSeconds: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  glowColor: string;
  bgGradient: string;
}

const LEVEL_CONFIGS: LevelConfig[] = [
  {
    name: "Novata Emocional",
    minSeconds: 0,
    icon: User,
    color: "text-zinc-300",
    glowColor: "rgba(161, 161, 170, 0.3)",
    bgGradient: "linear-gradient(135deg, #3f3f46 0%, #27272a 100%)",
  },
  {
    name: "Aprendiza de Hielo",
    minSeconds: 12 * 60 * 60,
    icon: Shield,
    color: "text-amber-500",
    glowColor: "rgba(245, 158, 11, 0.3)",
    bgGradient: "linear-gradient(135deg, #b45309 0%, #78350f 100%)",
  },
  {
    name: "Guerrera en Proceso",
    minSeconds: 24 * 60 * 60,
    icon: Sword,
    color: "text-gray-200",
    glowColor: "rgba(229, 231, 235, 0.3)",
    bgGradient: "linear-gradient(135deg, #6b7280 0%, #374151 100%)",
  },
  {
    name: "Dama de Acero",
    minSeconds: 3 * 24 * 60 * 60,
    icon: Shield,
    color: "text-accent-gold",
    glowColor: "rgba(212, 175, 55, 0.3)",
    bgGradient: "linear-gradient(135deg, #D4AF37 0%, #92750f 100%)",
  },
  {
    name: "Reina del Hielo",
    minSeconds: 7 * 24 * 60 * 60,
    icon: Crown,
    color: "text-cyan-400",
    glowColor: "rgba(34, 211, 238, 0.3)",
    bgGradient: "linear-gradient(135deg, #0891b2 0%, #164e63 100%)",
  },
  {
    name: "Emperatriz Inquebrantable",
    minSeconds: 21 * 24 * 60 * 60,
    icon: Sparkles,
    color: "text-accent-gold",
    glowColor: "rgba(212, 175, 55, 0.5)",
    bgGradient: "linear-gradient(135deg, #D4AF37 0%, #fbbf24 50%, #D4AF37 100%)",
  },
];

function getLevel(streakSeconds: number): LevelConfig {
  let currentLevel = LEVEL_CONFIGS[0];
  for (const level of LEVEL_CONFIGS) {
    if (streakSeconds >= level.minSeconds) currentLevel = level;
  }
  return currentLevel;
}

function getNextLevel(streakSeconds: number): LevelConfig | null {
  for (const level of LEVEL_CONFIGS) {
    if (streakSeconds < level.minSeconds) return level;
  }
  return null;
}

export function LevelBadge({ streakSeconds }: LevelBadgeProps) {
  const currentLevel = getLevel(streakSeconds);
  const nextLevel = getNextLevel(streakSeconds);

  const progressToNext = nextLevel
    ? Math.min(100, ((streakSeconds - currentLevel.minSeconds) / (nextLevel.minSeconds - currentLevel.minSeconds)) * 100)
    : 100;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          boxShadow: `0 0 20px ${currentLevel.glowColor}, 0 0 40px ${currentLevel.glowColor}`,
          border: `2px solid ${currentLevel.glowColor}`,
        }}
      >
        <img
          src="/logo_app.png"
          alt="No Mas Migajas"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="flex flex-col items-center">
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.25em] font-semibold">
          Nivel Actual
        </p>
        <p className={`text-base font-bold tracking-wide ${currentLevel.color} text-glow-gold mt-0.5`}>
          {currentLevel.name}
        </p>

        {nextLevel && (
          <div className="mt-2 flex items-center gap-2.5">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #D4AF37, #fbbf24)" }}
              />
            </div>
            <span className="text-xs text-accent-gold font-mono font-semibold">
              {Math.round(progressToNext)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
