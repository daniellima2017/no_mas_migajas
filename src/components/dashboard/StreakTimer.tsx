"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface StreakTimerProps {
  startedAt: string;
}

interface TimeDiff {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeDiff(startedAt: string): TimeDiff {
  const start = new Date(startedAt).getTime();
  const diff = Math.max(0, Date.now() - start);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
    minutes: Math.floor(diff / (1000 * 60)) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function padZero(value: number): string {
  return value.toString().padStart(2, "0");
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="glass-card px-3 py-2 sm:px-4 sm:py-3 min-w-[3.2rem] sm:min-w-[4.2rem]"
        style={{
          borderColor: "rgba(212, 175, 55, 0.12)",
          boxShadow: "0 0 15px rgba(212, 175, 55, 0.05), 0 0 30px rgba(185, 28, 28, 0.03)",
        }}
      >
        <motion.span
          key={value}
          initial={{ opacity: 0.5, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="block text-center text-2xl sm:text-4xl md:text-5xl font-bold font-mono text-accent-gold text-glow-gold"
        >
          {value}
        </motion.span>
      </div>
      <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest mt-2 font-medium">
        {label}
      </span>
    </div>
  );
}

export function StreakTimer({ startedAt }: StreakTimerProps) {
  const [timeDiff, setTimeDiff] = useState<TimeDiff>(() => calculateTimeDiff(startedAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDiff(calculateTimeDiff(startedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const digits = useMemo(() => ({
    days: padZero(timeDiff.days),
    hours: padZero(timeDiff.hours),
    minutes: padZero(timeDiff.minutes),
    seconds: padZero(timeDiff.seconds),
  }), [timeDiff]);

  return (
    <div className="flex flex-col items-center space-y-5">
      <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-semibold">
        Tiempo sin migajas
      </p>

      <div className="flex items-start gap-2 sm:gap-3">
        <TimeUnit value={digits.days} label="Dias" />
        <span className="text-accent-gold/40 text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">:</span>
        <TimeUnit value={digits.hours} label="Horas" />
        <span className="text-accent-gold/40 text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">:</span>
        <TimeUnit value={digits.minutes} label="Min" />
        <span className="text-accent-gold/40 text-2xl sm:text-4xl font-bold mt-2 sm:mt-3">:</span>
        <TimeUnit value={digits.seconds} label="Seg" />
      </div>

      <div className="flex items-center gap-5 text-zinc-500 text-xs">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-accent-gold"
            style={{ boxShadow: "0 0 8px rgba(212, 175, 55, 0.5)" }}
          />
          <span>Streak activo</span>
        </div>
        <div>
          <span className="text-accent-gold font-semibold font-mono">{timeDiff.days}</span>
          <span className="ml-1">dias completados</span>
        </div>
      </div>
    </div>
  );
}
