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
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(155, 17, 30, 0.4) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Logo disc */}
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
            border: "2px solid rgba(155, 17, 30, 0.5)",
            boxShadow:
              "0 0 30px rgba(155, 17, 30, 0.3), inset 0 0 20px rgba(0,0,0,0.8)",
          }}
        >
          <span
            className="font-[var(--font-michroma)] text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #9B111E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            N
          </span>
        </div>
      </motion.div>
    </header>
  );
}
