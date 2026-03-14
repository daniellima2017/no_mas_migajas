"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { GlitchEffect } from "./GlitchEffect";

interface SimulatorOutputProps {
  response: string | null;
  isLoading: boolean;
  classification: string | null;
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

export function SimulatorOutput({ response, isLoading, classification }: SimulatorOutputProps) {
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
            <Card className="bg-bg-danger border-border-danger overflow-hidden">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-accent-red" />
                    <span className="text-accent-red font-bold text-sm uppercase tracking-wider">
                      Traduccion Real
                    </span>
                  </div>
                  {classification && (
                    <span className="text-xs bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-1 rounded">
                      {CLASSIFICATION_LABELS[classification] || classification}
                    </span>
                  )}
                </div>

                <div className="border-t border-border-danger pt-4">
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {response.replace(/\[[A-Z\s]+\]\s*/g, "").trim()}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500 pt-2 border-t border-border-danger">
                  <EyeOff className="w-3 h-3" />
                  <span>Esta es la realidad oculta del mensaje</span>
                </div>
              </div>
            </Card>
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