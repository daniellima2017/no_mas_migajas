"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, AlertTriangle } from "lucide-react";
import { useScarcity } from "./ScarcityContext";

export function HeroBlock() {
  const { connected, remaining } = useScarcity();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-2 text-center max-w-2xl mx-auto"
    >
      <h1
        className="font-[var(--font-michroma)] text-2xl md:text-4xl leading-tight font-bold mb-6"
        style={{
          background: "linear-gradient(135deg, #D4AF37 0%, #c9a227 50%, #9B111E 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        El test de 60 segundos que destruye la mentira que te repites cada noche antes de dormir.
      </h1>

      {/* App Mockup Image - floating animation */}
      <motion.div
        className="flex justify-center mb-4"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/mockup2.png"
          alt="No Mas Migajas - Software de Rescate Emocional"
          width={600}
          height={1200}
          className="w-[95vw] max-w-[520px] md:max-w-[580px] h-auto"
          priority
        />
      </motion.div>

      <p className="text-xs uppercase tracking-widest text-zinc-500 font-[var(--font-mono)] mb-6">
        App de Rescate Emocional con IA
      </p>

      <p className="font-[var(--font-inter)] text-zinc-400 text-lg md:text-xl leading-relaxed mb-8">
        Mas de 12,400 mujeres ya descubrieron su{" "}
        <span className="text-[#D4AF37] font-semibold">Indice de Migajas™</span> y
        dejaron de mendigar atencion de un hombre que las tiene como Plan B. Hoy
        es tu turno de ver la verdad que nadie se atreve a decirte.
      </p>

      <div className="flex flex-col items-center gap-3 text-sm">
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
            Usuarias conectadas ahora:{" "}
            <motion.span
              key={connected}
              initial={{ scale: 1.4, color: "#22c55e" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.6 }}
              className="font-semibold inline-block"
            >
              {connected}
            </motion.span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[#9B111E]" />
          <span className="text-[#9B111E] font-semibold font-[var(--font-mono)]">
            Accesos restantes:{" "}
            <motion.span
              key={remaining}
              initial={{ scale: 1.4, color: "#ef4444" }}
              animate={{ scale: 1, color: "#9B111E" }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              {remaining}
            </motion.span>
          </span>
        </div>
      </div>
    </motion.section>
  );
}
