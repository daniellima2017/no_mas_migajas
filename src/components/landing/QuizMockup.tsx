"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    text: "Cuando el no responde en horas, tu...",
    options: ["Espero tranquila", "Reviso si leyo el mensaje", "Le escribo de nuevo"],
    selected: 2,
  },
  {
    text: "Si el cancela planes, tu reaccion es...",
    options: ["Lo entiendo siempre", "Me molesto pero no digo nada", "Busco justificarlo"],
    selected: 1,
  },
  {
    text: "Sientes que das mas de lo que recibes?",
    options: ["Nunca", "A veces", "Constantemente"],
    selected: 2,
  },
];

const RESULT = {
  score: 78,
  level: "Zona de Migajas",
  color: "#ef4444",
};

type Phase = "idle" | "q1" | "a1" | "q2" | "a2" | "q3" | "a3" | "processing" | "result";

export function QuizMockup() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (hasPlayed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true);
          runSequence();
        }
      },
      { threshold: 0.4 }
    );

    const el = document.getElementById("quiz-mockup");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasPlayed]);

  function runSequence() {
    const steps: { phase: Phase; delay: number }[] = [
      { phase: "q1", delay: 600 },
      { phase: "a1", delay: 2000 },
      { phase: "q2", delay: 3200 },
      { phase: "a2", delay: 4400 },
      { phase: "q3", delay: 5600 },
      { phase: "a3", delay: 6800 },
      { phase: "processing", delay: 8000 },
      { phase: "result", delay: 10000 },
    ];
    steps.forEach(({ phase: p, delay }) => {
      setTimeout(() => setPhase(p), delay);
    });
  }

  const currentQ =
    phase === "q1" || phase === "a1" ? 0 : phase === "q2" || phase === "a2" ? 1 : 2;
  const showQuestion = phase.startsWith("q") || phase.startsWith("a");
  const showAnswer = phase === "a1" || phase === "a2" || phase === "a3";

  return (
    <motion.div
      id="quiz-mockup"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-8 max-w-xl mx-auto"
    >
      <p className="text-[10px] uppercase tracking-widest text-center text-zinc-600 font-[var(--font-mono)] mb-4">
        Detector de Migajas en accion
      </p>

      {/* Phone frame */}
      <div className="flex justify-center">
        <div
          className="relative w-[300px] rounded-[36px] p-3"
          style={{
            background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
            border: "3px solid #333",
            boxShadow: "0 0 50px rgba(212, 175, 55, 0.08), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-b-2xl z-10" />

          <div className="rounded-[24px] overflow-hidden" style={{ background: "#0a0a0a" }}>
            {/* App header */}
            <div className="px-4 pt-10 pb-3 text-center">
              <p className="font-[var(--font-michroma)] text-xs text-white">
                Indice de Migajas™
              </p>
              <p className="text-[9px] text-zinc-600">Diagnostico de tu relacion</p>
            </div>

            {/* Progress bar */}
            <div className="px-4 mb-4">
              <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-1 rounded-full"
                  style={{ background: "linear-gradient(90deg, #D4AF37, #9B111E)" }}
                  animate={{
                    width:
                      phase === "idle"
                        ? "0%"
                        : phase === "q1" || phase === "a1"
                          ? "33%"
                          : phase === "q2" || phase === "a2"
                            ? "66%"
                            : "100%",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[8px] text-zinc-600 mt-1 text-right">
                {phase === "idle"
                  ? "0/15"
                  : phase === "q1" || phase === "a1"
                    ? "5/15"
                    : phase === "q2" || phase === "a2"
                      ? "10/15"
                      : "15/15"}
              </p>
            </div>

            {/* Question area */}
            <div className="px-4 min-h-[200px]">
              <AnimatePresence mode="wait">
                {showQuestion && (
                  <motion.div
                    key={`q-${currentQ}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-[11px] text-white font-semibold font-[var(--font-inter)] mb-4">
                      {QUESTIONS[currentQ].text}
                    </p>

                    <div className="space-y-2">
                      {QUESTIONS[currentQ].options.map((opt, j) => {
                        const isSelected = showAnswer && j === QUESTIONS[currentQ].selected;
                        return (
                          <motion.div
                            key={j}
                            animate={
                              isSelected
                                ? { scale: [1, 1.03, 1] }
                                : {}
                            }
                            transition={{ duration: 0.3 }}
                            className="rounded-lg px-3 py-2.5 text-[10px] font-[var(--font-inter)]"
                            style={{
                              background: isSelected
                                ? "rgba(155, 17, 30, 0.15)"
                                : "rgba(255,255,255,0.03)",
                              border: isSelected
                                ? "1px solid rgba(155, 17, 30, 0.5)"
                                : "1px solid rgba(255,255,255,0.08)",
                              color: isSelected ? "#ef4444" : "#a1a1aa",
                            }}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{
                                  border: isSelected
                                    ? "2px solid #9B111E"
                                    : "1.5px solid rgba(255,255,255,0.15)",
                                  background: isSelected ? "#9B111E" : "transparent",
                                }}
                              >
                                {isSelected && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-1.5 h-1.5 rounded-full bg-white"
                                  />
                                )}
                              </span>
                              {opt}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {phase === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full mb-4"
                      style={{ border: "3px solid rgba(212, 175, 55, 0.2)", borderTopColor: "#D4AF37" }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-[10px] text-[#D4AF37] font-[var(--font-mono)] uppercase tracking-wider"
                    >
                      Calculando tu Indice...
                    </motion.p>
                  </motion.div>
                )}

                {phase === "result" && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-4"
                  >
                    <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-3">
                      Tu Indice de Migajas
                    </p>

                    {/* Score circle */}
                    <div className="flex justify-center mb-3">
                      <div
                        className="relative w-20 h-20 rounded-full flex items-center justify-center"
                        style={{
                          background: `conic-gradient(${RESULT.color} ${RESULT.score}%, rgba(255,255,255,0.05) ${RESULT.score}%)`,
                        }}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ background: "#0a0a0a" }}
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="font-[var(--font-mono)] text-xl font-bold"
                            style={{ color: RESULT.color }}
                          >
                            {RESULT.score}
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span
                        className="inline-block text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
                        style={{
                          background: "rgba(239, 68, 68, 0.12)",
                          color: RESULT.color,
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        {RESULT.level}
                      </span>
                      <p className="text-[10px] text-zinc-500 font-[var(--font-inter)] mt-2 leading-relaxed px-2">
                        Tu nivel de dependencia emocional esta en zona critica. Necesitas
                        activar el protocolo de rescate.
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {phase === "idle" && (
                  <motion.div
                    key="idle"
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                      style={{ background: "rgba(212, 175, 55, 0.08)" }}
                    >
                      <span className="text-lg">🔬</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 font-[var(--font-inter)]">
                      Iniciando diagnostico...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6" />
          </div>
        </div>
      </div>

      <p className="text-center text-zinc-500 text-xs font-[var(--font-inter)] mt-6">
        15 preguntas calibradas que escanean tu relacion y revelan{" "}
        <span className="text-[#9B111E] font-semibold">la verdad que ya sospechas.</span>
      </p>
    </motion.div>
  );
}
