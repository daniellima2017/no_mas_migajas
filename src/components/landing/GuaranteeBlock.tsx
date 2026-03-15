"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function GuaranteeBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      <div
        className="rounded-2xl p-6 md:p-8 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.04) 0%, rgba(10, 10, 15, 0.98) 100%)",
          border: "1px solid rgba(212, 175, 55, 0.2)",
          boxShadow: "0 0 40px rgba(212, 175, 55, 0.06)",
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: "rgba(212, 175, 55, 0.1)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
          }}
        >
          <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
        </div>

        <h2 className="font-[var(--font-michroma)] text-base md:text-lg text-[#D4AF37] mb-2">
          Garantia de Dignidad — 7 dias
        </h2>

        <p className="font-[var(--font-inter)] text-zinc-400 text-base leading-relaxed mb-4">
          Si en la primera semana el Simulador Hielo Seco no te salvo la dignidad al menos 3 veces,
          o si el Indice de Migajas no te dio la claridad que necesitabas para dejar de sufrir, te
          devolvemos el 100% de tu inversion.
        </p>

        <p className="font-[var(--font-inter)] text-zinc-500 text-base">
          Sin preguntas. Sin resentimientos. Sin hacerte sentir culpable{" "}
          <span className="text-zinc-600 italic">(de eso ya se encarga el)</span>. El riesgo es todo
          mio.
        </p>
      </div>
    </motion.section>
  );
}
