"use client";

import { motion } from "framer-motion";

const LEVELS = [
  {
    color: "#22c55e",
    bg: "rgba(34, 197, 94, 0.08)",
    border: "rgba(34, 197, 94, 0.25)",
    label: "Dignidad Estable",
    description: "Tu dignidad esta intacta. Tienes el control de tu vida emocional.",
  },
  {
    color: "#eab308",
    bg: "rgba(234, 179, 8, 0.08)",
    border: "rgba(234, 179, 8, 0.25)",
    label: "Alerta de Desequilibrio",
    description: "Hay senales de inestabilidad. Tu das mas de lo que recibes.",
  },
  {
    color: "#f97316",
    bg: "rgba(249, 115, 22, 0.08)",
    border: "rgba(249, 115, 22, 0.25)",
    label: "Zona de Migajas",
    description: "El te mantiene cerca, pero no te elige. Estas atrapada en un ciclo.",
  },
  {
    color: "#ef4444",
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.25)",
    label: "Mendicidad Emocional",
    description: "Tu autoestima esta en crisis. Todo tu valor depende de el.",
  },
];

export function LevelsBlock() {
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
        ¿En cual de estos 4 niveles estas tu?
      </h2>

      <div className="space-y-4">
        {LEVELS.map((level, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
            className="rounded-xl p-4 flex items-start gap-4"
            style={{
              background: level.bg,
              border: `1px solid ${level.border}`,
            }}
          >
            <div
              className="flex-shrink-0 w-4 h-4 rounded-full mt-1"
              style={{ background: level.color, boxShadow: `0 0 12px ${level.color}50` }}
            />
            <div>
              <p className="font-[var(--font-michroma)] text-sm font-bold mb-1" style={{ color: level.color }}>
                {level.label}
              </p>
              <p className="font-[var(--font-inter)] text-zinc-400 text-sm">
                {level.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="font-[var(--font-inter)] text-center text-sm text-zinc-400 mt-8">
        <span className="text-[#9B111E] font-bold">El 73% de las mujeres</span> que hacen el test
        descubren que estan en Zona de Migajas o peor. La mayoria pensaba que era &quot;solo una mala
        racha&quot;. No lo es. Y cuanto mas tiempo pase sin que lo veas, mas dificil sera salir.
      </p>
    </motion.section>
  );
}
