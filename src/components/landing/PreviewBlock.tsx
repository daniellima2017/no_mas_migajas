"use client";

import { motion } from "framer-motion";

export function PreviewBlock() {
  const score = 72;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      <h2
        className="font-[var(--font-michroma)] text-lg md:text-xl text-center mb-8"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #9B111E)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Cuando activas el sistema, lo primero que ves es esto:
      </h2>

      {/* iPhone mockup */}
      <div className="flex justify-center">
        <div
          className="relative w-[280px] rounded-[40px] p-3"
          style={{
            background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
            border: "3px solid #333",
            boxShadow: "0 0 60px rgba(155, 17, 30, 0.15), 0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-b-2xl z-10" />

          {/* Screen */}
          <div
            className="rounded-[28px] overflow-hidden p-6 pt-10"
            style={{ background: "#0a0a0a" }}
          >
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center mb-4 font-[var(--font-mono)]">
              Tu Diagnostico
            </p>

            {/* Radial gauge */}
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="8"
                  />
                  {/* Progress arc */}
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#9B111E" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="font-[var(--font-mono)] text-3xl font-bold text-[#f97316]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.5 }}
                  >
                    72%
                  </motion.span>
                </div>
              </div>
            </div>

            {/* Data */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-[var(--font-mono)]">
                  Nivel
                </span>
                <span className="text-xs font-bold text-[#f97316] font-[var(--font-mono)]">
                  Zona de Migajas
                </span>
              </div>
              <div
                className="h-px w-full"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-[var(--font-mono)]">
                  Veredicto
                </span>
                <span className="text-[10px] text-zinc-400 text-right max-w-[60%] font-[var(--font-inter)]">
                  Estas atrapada en un ciclo de migajas emocionales.
                </span>
              </div>
              <div
                className="h-px w-full"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-[var(--font-mono)]">
                  Puntos
                </span>
                <span className="text-xs font-mono text-white font-semibold">
                  108 <span className="text-zinc-600">/ 150</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 space-y-4">
        <p className="font-[var(--font-inter)] text-zinc-400 text-sm">
          Ese numero es tu realidad. No lo que el te dice. No lo que tus amigas opinan. No lo que tu
          quieres creer.{" "}
          <span className="text-white font-semibold">
            Es lo que los datos dicen sobre tu relacion.
          </span>{" "}
          Y una vez que lo ves, no puedes des-verlo.
        </p>

        <p className="font-[var(--font-mono)] text-[#D4AF37] text-sm font-semibold">
          El diagnostico toma menos de 60 segundos. 15 preguntas. Resultado inmediato.
        </p>
      </div>
    </motion.section>
  );
}
