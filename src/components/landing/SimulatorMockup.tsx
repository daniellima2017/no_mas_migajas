"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEMO_MESSAGE = "Solo queria saber como estas";

const DEMO_RESPONSE = {
  classification: "VALIDACION",
  text: "El no quiere saber como estas. Esta midiendo si sigues disponible para el. Con ese mensaje casual esta testeando si le respondes rapido, si le das atencion. Quiere confirmar que sigue teniendo acceso emocional a ti.",
};

export function SimulatorMockup() {
  const [phase, setPhase] = useState<"idle" | "typing" | "processing" | "result">("idle");
  const [typedChars, setTypedChars] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (hasPlayed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true);
          startAnimation();
        }
      },
      { threshold: 0.5 }
    );

    const el = document.getElementById("simulator-mockup");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasPlayed]);

  function startAnimation() {
    setPhase("typing");
    setTypedChars(0);

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      charIndex++;
      setTypedChars(charIndex);
      if (charIndex >= DEMO_MESSAGE.length) {
        clearInterval(typeInterval);
        setTimeout(() => setPhase("processing"), 500);
        setTimeout(() => setPhase("result"), 2500);
      }
    }, 60);
  }

  return (
    <motion.section
      id="simulator-mockup"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      <p className="text-[10px] uppercase tracking-widest text-center text-zinc-600 font-[var(--font-mono)] mb-4">
        Simulador en accion
      </p>

      {/* Phone frame */}
      <div className="flex justify-center">
        <div
          className="relative w-[300px] rounded-[36px] p-3"
          style={{
            background: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
            border: "3px solid #333",
            boxShadow: "0 0 50px rgba(155, 17, 30, 0.12), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1a1a1a] rounded-b-2xl z-10" />

          <div className="rounded-[24px] overflow-hidden" style={{ background: "#0a0a0a" }}>
            {/* App header */}
            <div className="px-4 pt-10 pb-3 text-center">
              <p className="font-[var(--font-michroma)] text-xs text-white">Hielo Seco</p>
              <p className="text-[9px] text-zinc-600">Simulador de traduccion emocional</p>
            </div>

            {/* Mode selector */}
            <div className="px-4 mb-3">
              <div
                className="rounded-lg p-2.5 text-center"
                style={{
                  background: "rgba(155, 17, 30, 0.08)",
                  border: "1px solid rgba(155, 17, 30, 0.25)",
                }}
              >
                <p className="text-[9px] text-[#9B111E] font-bold uppercase tracking-wider">
                  Que te dijo?
                </p>
              </div>
            </div>

            {/* Textarea */}
            <div className="px-4 mb-3">
              <div
                className="rounded-lg p-3 min-h-[50px]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-xs text-zinc-300 font-[var(--font-inter)]">
                  {phase === "idle" ? (
                    <span className="text-zinc-600">Pega aqui el mensaje...</span>
                  ) : (
                    <>
                      {DEMO_MESSAGE.slice(0, typedChars)}
                      {phase === "typing" && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="text-[#D4AF37]"
                        >
                          |
                        </motion.span>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Process button */}
            <div className="px-4 mb-3">
              <div
                className="rounded-lg py-2 text-center text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background:
                    phase === "processing"
                      ? "rgba(212, 175, 55, 0.3)"
                      : "linear-gradient(135deg, #D4AF37, #B8941F)",
                  color: phase === "processing" ? "#D4AF37" : "#000",
                }}
              >
                {phase === "processing" ? (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Procesando...
                  </motion.span>
                ) : (
                  "Procesar"
                )}
              </div>
            </div>

            {/* Result */}
            <AnimatePresence>
              {phase === "result" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="px-4 pb-6"
                >
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(155, 17, 30, 0.06)",
                      border: "1px solid rgba(155, 17, 30, 0.2)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(234, 179, 8, 0.15)",
                          color: "#eab308",
                          border: "1px solid rgba(234, 179, 8, 0.3)",
                        }}
                      >
                        {DEMO_RESPONSE.classification}
                      </span>
                      <span className="text-[8px] text-zinc-600">Traduccion Real</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-[var(--font-inter)]">
                      {DEMO_RESPONSE.text}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {phase === "idle" && <div className="h-6" />}
          </div>
        </div>
      </div>

      <p className="text-center text-zinc-500 text-xs font-[var(--font-inter)] mt-6">
        Esto es lo que Hielo Seco hace con un simple{" "}
        <span className="text-zinc-300 italic">&quot;Solo queria saber como estas&quot;</span>.
        <br />
        <span className="text-[#9B111E] font-semibold">Imagina lo que revela con los mensajes de el.</span>
      </p>
    </motion.section>
  );
}
