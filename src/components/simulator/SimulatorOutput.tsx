"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import { GlitchEffect } from "./GlitchEffect";

interface SimulatorOutputProps {
  response: string | null;
  isLoading: boolean;
  classification: string | null;
  mode?: "received" | "sending" | null;
}

const CLASSIFICATION_LABELS: Record<string, string> = {
  // Received mode
  CONTROL: "INTENTO DE CONTROL",
  VALIDACION: "BUSQUEDA DE VALIDACION",
  RECONEXION: "INTENTO DE RECONEXION",
  CULPA: "MANIPULACION POR CULPA",
  NEUTRAL: "MENSAJE NEUTRAL",
  // Sending mode
  "ALTO RIESGO": "ALTO RIESGO - NO ENVIES",
  "RIESGO MODERADO": "RIESGO MODERADO",
  "BAJO RIESGO": "BAJO RIESGO",
  "SEGURO": "SEGURO PARA ENVIAR",
};

export function SimulatorOutput({ response, isLoading, classification, mode }: SimulatorOutputProps) {
  const isReceived = mode === "received" || !mode;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlitchEffect />
          </motion.div>
        ) : response ? (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: isReceived
                  ? "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(239, 68, 68, 0.02))"
                  : "linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.02))",
                border: isReceived
                  ? "1px solid rgba(239, 68, 68, 0.3)"
                  : "1px solid rgba(212, 175, 55, 0.3)",
                boxShadow: isReceived
                  ? "0 0 30px rgba(239, 68, 68, 0.08)"
                  : "0 0 30px rgba(212, 175, 55, 0.08)",
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{
                  background: isReceived
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(212, 175, 55, 0.1)",
                  borderBottom: isReceived
                    ? "1px solid rgba(239, 68, 68, 0.15)"
                    : "1px solid rgba(212, 175, 55, 0.15)",
                }}
              >
                <div className="flex items-center gap-2">
                  {isReceived ? (
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-accent-gold" />
                  )}
                  <span className={`font-bold text-sm uppercase tracking-wider ${isReceived ? "text-red-400" : "text-accent-gold"}`}>
                    {isReceived ? "Traduccion Real" : "Analisis de Riesgo"}
                  </span>
                </div>
                {classification && (
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background: isReceived
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(212, 175, 55, 0.2)",
                      border: isReceived
                        ? "1px solid rgba(239, 68, 68, 0.4)"
                        : "1px solid rgba(212, 175, 55, 0.4)",
                      color: isReceived ? "#f87171" : "#D4AF37",
                    }}
                  >
                    {CLASSIFICATION_LABELS[classification] || classification}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {response.replace(/\[[A-Z\s]+\]\s*/g, "").trim()}
                </p>

                <div
                  className="flex items-center gap-2 text-xs pt-3"
                  style={{
                    borderTop: isReceived
                      ? "1px solid rgba(239, 68, 68, 0.1)"
                      : "1px solid rgba(212, 175, 55, 0.1)",
                    color: isReceived ? "rgba(239, 68, 68, 0.5)" : "rgba(212, 175, 55, 0.5)",
                  }}
                >
                  {isReceived ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Esta es la realidad oculta del mensaje</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Evaluacion de impacto de tu mensaje</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-bg-card border-border-default p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Eye className="w-10 h-10 text-zinc-600 mb-3" />
                <p className="text-zinc-400 text-sm">
                  Ingresa un mensaje para ver su traduccion real
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
