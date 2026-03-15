"use client";

import { motion } from "framer-motion";

export function MiniCTA() {
  function scrollToPricing() {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="px-5 py-6 max-w-xl mx-auto"
    >
      <motion.button
        onClick={scrollToPricing}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1)",
            "0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.2)",
            "0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1)",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-full py-3.5 rounded-xl font-[var(--font-michroma)] text-xs md:text-sm font-bold uppercase tracking-wider text-black cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #D4AF37 0%, #c9a227 50%, #B8941F 100%)",
          border: "1px solid rgba(212, 175, 55, 0.5)",
        }}
      >
        Activar mi Detector de Migajas
      </motion.button>
      <p className="text-center text-zinc-600 text-[10px] mt-2 font-[var(--font-inter)]">
        Acceso inmediato. Garantia de 7 dias.
      </p>
    </motion.div>
  );
}
