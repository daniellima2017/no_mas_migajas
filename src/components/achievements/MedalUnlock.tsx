"use client";

import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Award, Crown, Diamond, Star, X } from "lucide-react";
import type { EliteAdvice } from "@/types";

interface MedalUnlockProps {
  isOpen: boolean;
  onClose: () => void;
  medalType: string;
  eliteAdvice: EliteAdvice | null;
}

const MEDAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bronze_12h: Shield,
  silver_24h: Award,
  gold_3d: Crown,
  diamond_7d: Diamond,
  dignity_21d: Star,
};

const MEDAL_LABELS: Record<string, string> = {
  bronze_12h: "12 Horas de Poder",
  silver_24h: "Un Dia Entero",
  gold_3d: "Tres Dias de Hielo",
  diamond_7d: "Una Semana Blindada",
  dignity_21d: "Dignidad Restaurada",
};

const GOLD_COLORS = ["#D4AF37", "#FFD700", "#B8860B", "#FAFAD2", "#EEE8AA"];

function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: GOLD_COLORS,
  });
  fire(0.2, {
    spread: 60,
    colors: GOLD_COLORS,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: GOLD_COLORS,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: GOLD_COLORS,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: GOLD_COLORS,
  });
}

function fireSideCannons() {
  const end = Date.now() + 2000;
  const colors = GOLD_COLORS;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: colors,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function fireCenterBurst() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6, x: 0.5 },
    colors: GOLD_COLORS,
    zIndex: 9999,
  });
}

export function MedalUnlock({ isOpen, onClose, medalType, eliteAdvice }: MedalUnlockProps) {
  const IconComponent = MEDAL_ICONS[medalType] || Shield;
  const medalLabel = MEDAL_LABELS[medalType] || "Medalla Desbloqueada";

  const triggerCelebration = useCallback(() => {
    setTimeout(() => {
      fireConfetti();
    }, 100);

    setTimeout(() => {
      fireCenterBurst();
    }, 300);

    setTimeout(() => {
      fireSideCannons();
    }, 500);
  }, []);

  useEffect(() => {
    if (isOpen) {
      triggerCelebration();
    }
  }, [isOpen, triggerCelebration]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-bg-card border-border-default text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-transparent sr-only">
              Medalla Desbloqueada
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-600 flex items-center justify-center">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(212, 175, 55, 0.4)",
                    "0 0 40px rgba(212, 175, 55, 0.8)",
                    "0 0 20px rgba(212, 175, 55, 0.4)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full"
              />
              <IconComponent className="w-12 h-12 text-white relative z-10" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-2"
          >
            <p className="text-zinc-400 text-xs uppercase tracking-widest">
              Nueva Medalla
            </p>
            <h2 className="text-2xl font-bold text-accent-gold">
              {medalLabel}
            </h2>
          </motion.div>

          {eliteAdvice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-bg-primary border border-border-default rounded-lg p-4 space-y-2"
            >
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                Consejo de Elite
              </p>
              <p className="text-white text-sm leading-relaxed">
                {eliteAdvice.content}
              </p>
            </motion.div>
          )}

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={onClose}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors"
          >
            Continuar
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}