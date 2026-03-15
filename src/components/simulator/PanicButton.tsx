"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface PanicButtonProps {
  onClick: () => void;
}

export function PanicButton({ onClick }: PanicButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full py-4 rounded-xl text-white font-bold uppercase tracking-widest transition-all duration-200"
      style={{
        background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #7F1D1D 100%)",
        border: "1px solid rgba(239, 68, 68, 0.5)",
        boxShadow: isHovered
          ? "0 6px 28px rgba(220, 38, 38, 0.5), 0 0 60px rgba(220, 38, 38, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
          : "0 4px 16px rgba(220, 38, 38, 0.35), 0 0 40px rgba(220, 38, 38, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: "0 0 30px rgba(220, 38, 38, 0.5)",
        }}
      />

      <div className="relative flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base">Boton de Panico</span>
      </div>
    </motion.button>
  );
}