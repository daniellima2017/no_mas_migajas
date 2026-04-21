"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmotionalBrakeProps {
  onContinue: () => void;
  onRecover: () => void;
}

const TOTAL_SECONDS = 300;
const SKIP_DELAY_SECONDS = 60;
const PHRASE_INTERVAL_MS = 15_000;

const BRAKE_PHRASES: string[] = [
  "Lo que sientes ahora es temporal. Lo que hagas con eso, no.",
  "Cada vez que vuelves, le confirmas que puede tratarte como quiera.",
  "No es amor lo que sientes. Es abstinencia disfrazada.",
  "Vas a escribirle, el va a responder lo minimo, y tu vas a sentirte peor.",
  "Piensa en la ultima vez que cediste. Cambio algo?",
  "El no esta pensando en ti ahora mismo. Por que tu si?",
  "Recaer no te acerca a el. Te aleja de ti misma.",
  "Tu dignidad no se negocia por un mensaje.",
  "Esto que sientes es tu cerebro pidiendo una dosis. No es tu corazon.",
  "Cinco minutos de debilidad pueden borrar semanas de progreso.",
  "No busques consuelo en quien te rompio.",
  "Cada segundo que resistes, tu cerebro aprende que puede vivir sin el.",
  "El alivio de escribirle dura minutos. La verguenza, dias.",
  "No eres debil por querer recaer. Eres fuerte por estar leyendo esto.",
  "Recuerda por que empezaste. Recuerda como te sentiste la ultima vez.",
  "El patron se repite porque tu lo permites. Hoy puedes romperlo.",
  "Lo que llamas necesidad es solo un habito que se puede desaprender.",
  "Estas a punto de darle poder sobre ti otra vez. Vale la pena?",
  "Tu peor dia sin el sigue siendo mejor que tu mejor dia mendigando.",
  "Si pasas estos cinco minutos, mira tu contador manana con orgullo.",
];

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function EmotionalBrake({ onContinue, onRecover }: EmotionalBrakeProps) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const hasExitedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0 && !hasExitedRef.current) {
      hasExitedRef.current = true;
      onContinue();
    }
  }, [secondsLeft, onContinue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % BRAKE_PHRASES.length);
    }, PHRASE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleRecover = useCallback(() => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    onRecover();
  }, [onRecover]);

  const handleContinue = useCallback(() => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;
    onContinue();
  }, [onContinue]);

  const showSkip = secondsLeft <= TOTAL_SECONDS - SKIP_DELAY_SECONDS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      role="alertdialog"
      aria-label="Freno emocional"
      style={{
        background: "radial-gradient(ellipse at center, rgba(185, 28, 28, 0.12) 0%, #0a0a0f 70%)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex flex-col items-center gap-8 max-w-md w-full">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-500 text-xs uppercase tracking-[0.25em] font-semibold text-center"
        >
          Antes de registrar tu recaida, lee esto
        </motion.p>

        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div
            className="text-6xl md:text-8xl font-bold font-mono text-center"
            style={{
              color: "#B91C1C",
              textShadow: "0 0 30px rgba(185, 28, 28, 0.5), 0 0 60px rgba(185, 28, 28, 0.2)",
            }}
          >
            {formatTime(secondsLeft)}
          </div>
        </motion.div>

        <div className="min-h-[5rem] flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-zinc-200 text-lg md:text-xl leading-relaxed font-medium text-center"
            >
              {BRAKE_PHRASES[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-3 mt-4">
          <button
            onClick={handleRecover}
            className="btn-premium px-8 py-3 rounded-xl text-sm tracking-wider"
          >
            Volvi en mi
          </button>

          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                whileHover={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                onClick={handleContinue}
                className="text-xs text-zinc-600 underline underline-offset-4 mt-2 transition-opacity"
              >
                Continuar de todas formas
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
