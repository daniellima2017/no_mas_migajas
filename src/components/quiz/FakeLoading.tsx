"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radar } from "lucide-react";

interface FakeLoadingProps {
  onComplete: () => void;
}

const LOADING_PHRASES = [
  "Cruzando datos de comportamiento...",
  "Analizando niveles de dependencia emocional...",
  "Generando veredicto de dignidad...",
];

const PHRASE_DURATION = 2500;

function getRandomDuration() {
  return Math.floor(Math.random() * 3000) + 5000; // 5000-8000ms
}

export function FakeLoading({ onComplete }: FakeLoadingProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [totalDuration] = useState(getRandomDuration);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setCurrentPhraseIndex((prev) =>
        prev < LOADING_PHRASES.length - 1 ? prev + 1 : prev
      );
    }, PHRASE_DURATION);

    const completionTimeout = setTimeout(() => {
      onComplete();
    }, totalDuration);

    return () => {
      clearInterval(phraseInterval);
      clearTimeout(completionTimeout);
    };
  }, [onComplete, totalDuration]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[300px] space-y-8">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(212, 175, 55, 0.08)",
            border: "2px solid rgba(212, 175, 55, 0.25)",
            boxShadow: "0 0 30px rgba(212, 175, 55, 0.15)",
          }}
        >
          <Radar className="w-10 h-10 text-accent-gold" />
        </div>
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: "2px solid transparent",
            borderTopColor: "#D4AF37",
          }}
        />
      </motion.div>

      <div className="h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhraseIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-zinc-200 text-center text-sm md:text-base font-medium"
          >
            {LOADING_PHRASES[currentPhraseIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-xs">
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255, 255, 255, 0.06)" }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: totalDuration / 1000, ease: "linear" }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #B8941F 0%, #D4AF37 50%, #fbbf24 100%)",
              boxShadow: "0 0 8px rgba(212, 175, 55, 0.4)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
