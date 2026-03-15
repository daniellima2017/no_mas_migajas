"use client";

import { motion } from "framer-motion";

export function LandingHeader() {
  return (
    <header className="py-8 flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Glow ring */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(155, 17, 30, 0.35) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <img
          src="/logo_lp.png"
          alt="No Mas Migajas"
          className="relative w-36 h-auto"
        />
      </motion.div>
    </header>
  );
}
