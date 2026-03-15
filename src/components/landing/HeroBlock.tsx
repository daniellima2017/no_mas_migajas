"use client";

import { motion } from "framer-motion";
import { Star, Flame, TrendingUp, Shield, Brain, Trophy, Zap } from "lucide-react";

export function HeroBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 text-center max-w-2xl mx-auto"
    >
      <h1
        className="font-[var(--font-michroma)] text-2xl md:text-4xl leading-tight font-bold mb-8"
        style={{
          background: "linear-gradient(135deg, #D4AF37 0%, #c9a227 50%, #9B111E 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        El test de 60 segundos que destruye la mentira que te repites cada noche antes de dormir.
      </h1>

      {/* Static App Mockup */}
      <div className="flex justify-center mb-8">
        <div
          className="relative w-[260px] rounded-[32px] p-2.5"
          style={{
            background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
            border: "3px solid #333",
            boxShadow: "0 0 60px rgba(212, 175, 55, 0.1), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-b-2xl z-10" />

          <div className="rounded-[22px] overflow-hidden p-3 pt-8" style={{ background: "#0a0a0a" }}>
            {/* App title bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[9px] font-[var(--font-michroma)] text-white">No Mas Migajas</span>
              </div>
              <span
                className="text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                style={{ background: "rgba(212, 175, 55, 0.15)", color: "#D4AF37" }}
              >
                IA Activa
              </span>
            </div>

            {/* Mini streak */}
            <div
              className="rounded-lg p-2.5 mb-2"
              style={{
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.06), rgba(10, 10, 15, 0.98))",
                border: "1px solid rgba(212, 175, 55, 0.15)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider font-[var(--font-mono)]">
                    Racha de Dignidad
                  </span>
                </div>
                <span className="text-[11px] font-bold font-[var(--font-mono)] text-white">5d 14h 23m</span>
              </div>
            </div>

            {/* Mini score */}
            <div
              className="rounded-lg p-2.5 mb-2"
              style={{
                background: "rgba(249, 115, 22, 0.06)",
                border: "1px solid rgba(249, 115, 22, 0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Indice de Migajas</span>
                </div>
                <span className="text-[11px] font-bold font-[var(--font-mono)] text-orange-400">72%</span>
              </div>
            </div>

            {/* Mini medal */}
            <div
              className="rounded-lg p-2.5 mb-3"
              style={{
                background: "rgba(212, 175, 55, 0.04)",
                border: "1px solid rgba(212, 175, 55, 0.12)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Medalla</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[#D4AF37] font-semibold">Guerrera 7d</span>
                  <div className="w-8 h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full w-[71%] rounded-full" style={{ background: "linear-gradient(90deg, #D4AF37, #9B111E)" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature icons row */}
            <div className="flex items-center justify-center gap-3">
              {[
                { icon: Shield, label: "Hielo Seco", color: "#9B111E" },
                { icon: Zap, label: "Panico", color: "#D4AF37" },
                { icon: Brain, label: "IA", color: "#8B5CF6" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                  >
                    <item.icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                  </div>
                  <span className="text-[7px] text-zinc-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Label below mockup */}
      <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-[var(--font-mono)] mb-6">
        Mini-App con Inteligencia Artificial
      </p>

      <p className="font-[var(--font-inter)] text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
        Mas de 12,400 mujeres ya descubrieron su{" "}
        <span className="text-[#D4AF37] font-semibold">Indice de Migajas™</span> y
        dejaron de mendigar atencion de un hombre que las tiene como Plan B. Hoy
        es tu turno de ver la verdad que nadie se atreve a decirte.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4"
                fill={i < 5 ? "#D4AF37" : "transparent"}
                stroke={i < 5 ? "#D4AF37" : "#555"}
              />
            ))}
          </div>
          <span className="text-zinc-400">
            Calificacion promedio: <span className="text-white font-semibold">4.8/5</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-zinc-400">
            Usuarias conectadas ahora: <span className="text-white font-semibold">37</span>
          </span>
        </div>
      </div>
    </motion.section>
  );
}
