"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Zap } from "lucide-react";
import { useScarcity } from "./ScarcityContext";

const CTA_URL = "https://pay.hotmart.com/D104918674A";

export function PricingBlock() {
  const { connected, remaining } = useScarcity();

  return (
    <motion.section
      id="pricing"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto text-center"
    >
      <p className="font-[var(--font-inter)] text-zinc-400 text-base mb-6">
        La verdad es dura:{" "}
        <span className="text-[#9B111E] font-bold">
          si sientes que necesitas este test, probablemente ya estas en el Plan B.
        </span>
      </p>

      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(10, 10, 15, 0.98) 100%)",
          border: "2px solid rgba(212, 175, 55, 0.35)",
          boxShadow: "0 0 60px rgba(212, 175, 55, 0.15), 0 0 120px rgba(212, 175, 55, 0.05)",
        }}
      >
        {/* Corner badge */}
        <div
          className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider"
          style={{ background: "#9B111E", color: "#fff" }}
        >
          -64% OFF
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-[#D4AF37]" />
          <p className="font-[var(--font-inter)] text-[#D4AF37] text-sm uppercase tracking-widest font-bold">
            Precio de lanzamiento hoy
          </p>
          <Zap className="w-4 h-4 text-[#D4AF37]" />
        </div>

        <div className="flex items-center justify-center gap-4 mb-3">
          <span
            className="line-through text-2xl font-bold font-[var(--font-mono)]"
            style={{ color: "#ef4444" }}
          >
            $47
          </span>
          <span
            className="font-[var(--font-mono)] text-6xl md:text-7xl font-bold"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #f5d442, #D4AF37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 12px rgba(212, 175, 55, 0.3))",
            }}
          >
            $17
          </span>
          <span className="text-zinc-400 text-base font-[var(--font-mono)]">USD</span>
        </div>
        <p className="font-[var(--font-inter)] text-zinc-500 text-sm mb-2">
          Pago unico · Acceso de por vida
        </p>
        <p className="font-[var(--font-inter)] text-[#D4AF37] text-xs mb-6 font-semibold">
          Ahorras $30 USD con el precio de lanzamiento
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-zinc-400 font-[var(--font-inter)]">
              Usuarias conectadas:{" "}
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

        <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="block w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.15)",
                "0 0 35px rgba(212, 175, 55, 0.6), 0 0 70px rgba(212, 175, 55, 0.25)",
                "0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.15)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full py-4 rounded-xl font-[var(--font-michroma)] text-sm md:text-base font-bold uppercase tracking-wider text-black"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #c9a227 50%, #B8941F 100%)",
              border: "1px solid rgba(212, 175, 55, 0.6)",
            }}
          >
            Activar mi Detector de Migajas
          </motion.button>
        </a>

        <p className="font-[var(--font-inter)] text-zinc-600 text-[10px] mt-4">
          Este precio es exclusivo para las primeras usuarias. Cuando se agoten los accesos, sube a $47.
        </p>
      </div>
    </motion.section>
  );
}
