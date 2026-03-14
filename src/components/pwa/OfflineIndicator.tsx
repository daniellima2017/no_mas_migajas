"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

interface OfflineIndicatorProps {
  show: boolean;
}

export function OfflineIndicator({ show }: OfflineIndicatorProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-bg-danger border-b border-border-danger px-4 py-2 flex items-center justify-center gap-2"
        >
          <WifiOff className="w-4 h-4 text-accent-red" />
          <span className="text-white text-sm font-medium">
            Sin conexion a internet
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}