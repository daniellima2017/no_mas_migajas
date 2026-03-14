"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles, AlertTriangle, PenLine } from "lucide-react";

interface JournalFeedbackProps {
  feedback: string | null;
  isLoading: boolean;
}

export function JournalFeedback({ feedback, isLoading }: JournalFeedbackProps) {
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
            <Card className="bg-bg-card border-border-default p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-accent-gold" />
                  </div>
                </motion.div>
                <p className="text-zinc-400 text-sm">Analizando tu desahogo...</p>
              </div>
            </Card>
          </motion.div>
        ) : feedback ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-bg-card border-border-default overflow-hidden">
              <div className="border-b border-border-default px-4 py-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-accent-gold" />
                  <span className="text-accent-gold font-semibold text-sm uppercase tracking-wider">
                    Choque de Realidad
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {feedback}
                </p>
              </div>
              <div className="border-t border-border-default px-4 py-3 bg-zinc-900/50">
                <p className="text-zinc-500 text-xs">
                  Este feedback es automatico y no sustituye ayuda profesional.
                </p>
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
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <PenLine className="w-6 h-6 text-zinc-500" />
                </div>
                <p className="text-zinc-400 text-sm">
                  Escribe un desahogo para recibir un choque de realidad
                </p>
                <p className="text-zinc-600 text-xs mt-2">
                  La IA analizara patrones emocionales en tu texto
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}