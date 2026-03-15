"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LandingHeader() {
  return (
    <header className="pt-3 pb-0 flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Glow ring */}
        <motion.div
          className="absolute -inset-6 rounded-full"
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
        <Image
          src="/logo_lp.png"
          alt="No Mas Migajas"
          width={160}
          height={160}
          className="relative w-36 h-auto"
          priority
        />
      </motion.div>
    </header>
  );
}
