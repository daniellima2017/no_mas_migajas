"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { SimulatorInput } from "@/components/simulator/SimulatorInput";
import { SimulatorOutput } from "@/components/simulator/SimulatorOutput";
import { PanicButton } from "@/components/simulator/PanicButton";
import { EmotionalBrake } from "@/components/streak/EmotionalBrake";
import { useSimulator } from "@/hooks/useSimulator";
import { AlertTriangle, History } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SimulatorPage() {
  const {
    response,
    isLoading,
    error,
    classification,
    panicResponse,
    activeMode,
    analyze,
    panic,
    reset,
  } = useSimulator();

  const [showHistory, setShowHistory] = useState(false);
  const [showBrake, setShowBrake] = useState(false);
  const [brakeToast, setBrakeToast] = useState<string | null>(null);

  const handlePanic = useCallback(() => {
    setShowBrake(true);
  }, []);

  const handleBrakeContinue = useCallback(async () => {
    setShowBrake(false);
    await panic();
  }, [panic]);

  const handleBrakeRecover = useCallback(() => {
    setShowBrake(false);
    setBrakeToast("Volviste en ti. Eso es fuerza real.");
    setTimeout(() => setBrakeToast(null), 4000);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Hielo Seco
          </h1>
          <p className="text-zinc-400 text-sm">
            Simulador de traducion emocional
          </p>
        </div>

        <div className="space-y-6">
          <SimulatorInput
            onSubmit={analyze}
            isLoading={isLoading}
          />

          <SimulatorOutput
            response={response}
            isLoading={isLoading}
            classification={classification}
            mode={activeMode}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-bg-danger border-border-danger p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent-red" />
                  <p className="text-accent-red text-sm">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {panicResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-zinc-900 border border-zinc-700 p-4">
                <div className="space-y-2">
                  <p className="text-zinc-400 text-xs uppercase tracking-wider">
                    Tiempo de bloqueo sugerido
                  </p>
                  <p className="text-white font-mono">
                    {new Date(panicResponse.blocked_until).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    ({panicResponse.block_duration_minutes} minutos)
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="pt-4 space-y-2">
            <PanicButton onClick={handlePanic} />
            <p className="text-xs text-zinc-500 text-center">
              Usalo si sientes urgencia extrema
            </p>
          </div>

          {response && !isLoading && (
            <div className="flex justify-center pt-2">
              <button
                onClick={reset}
                className="text-zinc-500 text-sm hover:text-white transition-colors"
              >
                Limpiar y empezar de nuevo
              </button>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-border-default">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-zinc-400 text-sm uppercase tracking-wider">
              Como usar el simulador
            </h2>
          </div>
          <div className="grid gap-4 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                1
              </div>
              <p className="text-zinc-300">
                Pega el mensaje que recibiste o lo que quieres enviar
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                2
              </div>
              <p className="text-zinc-300">
                Presiona PROCESAR para ver la traduccion real
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                3
              </div>
              <p className="text-zinc-300">
                Usa el boton de panico si sientes urgencia extrema
              </p>
            </div>
          </div>
        </div>
      </div>

      {showBrake && (
        <EmotionalBrake
          onContinue={handleBrakeContinue}
          onRecover={handleBrakeRecover}
        />
      )}

      {brakeToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-xl p-4 z-50"
          style={{
            background: "rgba(212, 175, 55, 0.1)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[#D4AF37] text-sm font-medium">{brakeToast}</p>
            <button
              onClick={() => setBrakeToast(null)}
              className="text-[#D4AF37]/60 hover:text-[#D4AF37] text-xs"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}