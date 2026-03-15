"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, TrendingUp } from "lucide-react";

export function DashboardMockup() {
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    // Count from a realistic number
    setSeconds(432067); // ~5d 0h 1m 7s
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      <p className="text-[10px] uppercase tracking-widest text-center text-zinc-600 font-[var(--font-mono)] mb-4">
        Dashboard en tiempo real
      </p>

      <div className="flex justify-center">
        <div
          className="relative w-[300px] rounded-[36px] p-3"
          style={{
            background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
            border: "3px solid #333",
            boxShadow: "0 0 50px rgba(212, 175, 55, 0.08), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-b-2xl z-10" />

          <div className="rounded-[24px] overflow-hidden p-4 pt-10 space-y-4" style={{ background: "#0a0a0a" }}>
            {/* Streak */}
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.06), rgba(10, 10, 15, 0.98))",
                border: "1px solid rgba(212, 175, 55, 0.15)",
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-[var(--font-mono)]">
                  Racha de Dignidad
                </span>
              </div>
              <div className="flex items-center justify-center gap-1.5 font-[var(--font-mono)]">
                <TimeUnit value={days} label="d" />
                <span className="text-zinc-600 text-xs">:</span>
                <TimeUnit value={hours} label="h" />
                <span className="text-zinc-600 text-xs">:</span>
                <TimeUnit value={mins} label="m" />
                <span className="text-zinc-600 text-xs">:</span>
                <TimeUnit value={secs} label="s" active />
              </div>
            </div>

            {/* Score card */}
            <div
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                background: "rgba(249, 115, 22, 0.06)",
                border: "1px solid rgba(249, 115, 22, 0.2)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(249, 115, 22, 0.12)" }}
              >
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-[8px] text-zinc-600 uppercase tracking-wider">Indice de Migajas</p>
                <p className="text-base font-bold font-[var(--font-mono)] text-orange-400">72%</p>
              </div>
            </div>

            {/* Medal */}
            <div
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                background: "rgba(212, 175, 55, 0.04)",
                border: "1px solid rgba(212, 175, 55, 0.12)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(212, 175, 55, 0.1)" }}
              >
                <Trophy className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-[8px] text-zinc-600 uppercase tracking-wider">Proxima medalla</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-semibold text-[#D4AF37]">Guerrera de 7 Dias</p>
                  <div className="w-12 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #D4AF37, #9B111E)" }}
                      initial={{ width: "0%" }}
                      whileInView={{ width: "71%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-zinc-500 text-xs font-[var(--font-inter)] mt-6">
        Cada segundo cuenta. Cada dia sin mendigar{" "}
        <span className="text-[#D4AF37] font-semibold">desbloquea medallas y sube tu nivel</span>.
      </p>
    </motion.section>
  );
}

function TimeUnit({ value, label, active }: { value: number; label: string; active?: boolean }) {
  return (
    <div className="flex items-baseline gap-0.5">
      <span className={`text-lg font-bold ${active ? "text-[#D4AF37]" : "text-white"}`}>
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-[8px] text-zinc-600">{label}</span>
    </div>
  );
}
