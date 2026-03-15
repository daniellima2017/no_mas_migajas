"use client";

import { motion } from "framer-motion";

const CTA_URL = "#"; // Replace with Hotmart checkout URL

export function MiniCTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-5 py-6 max-w-xl mx-auto"
    >
      <a href={CTA_URL} className="block">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-xl font-[var(--font-michroma)] text-xs md:text-sm font-bold uppercase tracking-wider text-black"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #c9a227 50%, #B8941F 100%)",
            boxShadow:
              "0 4px 16px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            border: "1px solid rgba(212, 175, 55, 0.5)",
          }}
        >
          Ver mi Indice de Migajas — $17
        </motion.button>
      </a>
      <p className="text-center text-zinc-600 text-[10px] mt-2 font-[var(--font-inter)]">
        Acceso inmediato. Pago unico. Garantia de 7 dias.
      </p>
    </motion.div>
  );
}
