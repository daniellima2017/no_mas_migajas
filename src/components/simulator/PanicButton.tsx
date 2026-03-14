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
      className="relative w-full py-4 rounded-lg bg-red-600 text-white font-bold uppercase tracking-wider transition-all duration-200 hover:bg-red-700"
      style={{
        boxShadow: isHovered
          ? "0 0 40px rgba(220, 38, 38, 0.6)"
          : "0 0 20px rgba(220, 38, 38, 0.4)",
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