"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function ClosingBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-16 max-w-xl mx-auto text-center"
    >
      <p className="font-[var(--font-inter)] text-zinc-500 text-sm mb-8">
        No permitas que pasen otros 10 anos viviendo de sobras emocionales. No esperes a que el
        cambie, porque no va a cambiar. No esperes a tocar fondo, porque el fondo siempre puede ser
        peor.
      </p>

      <div className="mb-10 space-y-4">
        <p className="font-[var(--font-michroma)] text-base text-white">
          Hay dos tipos de mujeres:
        </p>
        <p className="font-[var(--font-inter)] text-zinc-500 text-sm">
          Las que prefieren no saber la verdad.
        </p>
        <p
          className="font-[var(--font-michroma)] text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #9B111E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Y las que prefieren recuperar su dignidad.
        </p>
        <p className="font-[var(--font-inter)] text-white text-base font-semibold pt-2">
          Hoy decides cual eres.
        </p>
      </div>

      <p className="font-[var(--font-inter)] text-zinc-400 text-sm mb-6">
        Tu dignidad no tiene precio. Pero tu libertad hoy cuesta solo{" "}
        <span
          className="font-bold text-lg font-[var(--font-mono)]"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #c9a227)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          $17
        </span>
        .
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-zinc-400 font-[var(--font-inter)]">
            Usuarias conectadas: <span className="text-white font-semibold">37</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[#9B111E]" />
          <span className="text-[#9B111E] font-semibold font-[var(--font-mono)]">
            Accesos restantes: 84
          </span>
        </div>
      </div>

      <motion.button
        onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl font-[var(--font-michroma)] text-sm md:text-base font-bold uppercase tracking-wider text-black cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #D4AF37 0%, #c9a227 50%, #B8941F 100%)",
          boxShadow:
            "0 4px 20px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
          border: "1px solid rgba(212, 175, 55, 0.6)",
        }}
      >
        Activar mi Racha de Dignidad
      </motion.button>

      {/* Footer */}
      <div className="mt-16 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-zinc-700 text-[10px] font-[var(--font-inter)]">
          No Mas Migajas™ — Software de Rescate Emocional
        </p>
        <p className="text-zinc-800 text-[10px] font-[var(--font-inter)] mt-1">
          Este producto no reemplaza la terapia profesional. Si sientes que estas en peligro, busca
          ayuda inmediata.
        </p>
      </div>
    </motion.section>
  );
}
