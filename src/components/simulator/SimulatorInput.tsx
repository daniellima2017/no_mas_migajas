"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, WifiOff, ArrowDownLeft, Send } from "lucide-react";
import { useOnlineContext } from "@/components/pwa/OnlineStatusProvider";

interface SimulatorInputProps {
  onSubmit: (text: string, mode: "received" | "sending") => void;
  isLoading: boolean;
}

export function SimulatorInput({ onSubmit, isLoading }: SimulatorInputProps) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"received" | "sending">("received");
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const { isOnline } = useOnlineContext();

  const handleSubmit = useCallback(() => {
    if (!isOnline) {
      setShowOfflineWarning(true);
      setTimeout(() => setShowOfflineWarning(false), 3000);
      return;
    }

    if (text.trim() && !isLoading) {
      onSubmit(text.trim(), mode);
    }
  }, [text, mode, isLoading, onSubmit, isOnline]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode("received")}
          className="relative rounded-xl p-3 transition-all duration-200 flex flex-col items-center gap-2"
          style={{
            background: mode === "received"
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))"
              : "rgba(255, 255, 255, 0.03)",
            border: mode === "received"
              ? "2px solid rgba(239, 68, 68, 0.5)"
              : "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: mode === "received"
              ? "0 0 20px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(239, 68, 68, 0.1)"
              : "none",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: mode === "received"
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(255, 255, 255, 0.05)",
            }}
          >
            <ArrowDownLeft className={`w-5 h-5 ${mode === "received" ? "text-red-400" : "text-zinc-500"}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${mode === "received" ? "text-red-400" : "text-zinc-500"}`}>
            Que te dijo?
          </span>
          <span className={`text-[10px] ${mode === "received" ? "text-red-400/60" : "text-zinc-600"}`}>
            Mensaje recibido
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMode("sending")}
          className="relative rounded-xl p-3 transition-all duration-200 flex flex-col items-center gap-2"
          style={{
            background: mode === "sending"
              ? "linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))"
              : "rgba(255, 255, 255, 0.03)",
            border: mode === "sending"
              ? "2px solid rgba(212, 175, 55, 0.5)"
              : "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: mode === "sending"
              ? "0 0 20px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(212, 175, 55, 0.1)"
              : "none",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: mode === "sending"
                ? "rgba(212, 175, 55, 0.2)"
                : "rgba(255, 255, 255, 0.05)",
            }}
          >
            <Send className={`w-5 h-5 ${mode === "sending" ? "text-accent-gold" : "text-zinc-500"}`} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${mode === "sending" ? "text-accent-gold" : "text-zinc-500"}`}>
            Que quieres mandarle?
          </span>
          <span className={`text-[10px] ${mode === "sending" ? "text-accent-gold/60" : "text-zinc-600"}`}>
            Mensaje a enviar
          </span>
        </button>
      </div>

      <div className="space-y-2">
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: mode === "received"
              ? "1px solid rgba(239, 68, 68, 0.25)"
              : "1px solid rgba(212, 175, 55, 0.25)",
          }}
        >
          <div
            className="px-3 py-2 flex items-center gap-2"
            style={{
              background: mode === "received"
                ? "rgba(239, 68, 68, 0.08)"
                : "rgba(212, 175, 55, 0.08)",
            }}
          >
            {mode === "received" ? (
              <ArrowDownLeft className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Send className="w-3.5 h-3.5 text-accent-gold" />
            )}
            <span className={`text-[10px] font-bold uppercase tracking-widest ${mode === "received" ? "text-red-400" : "text-accent-gold"}`}>
              {mode === "received" ? "Mensaje recibido de el" : "Tu mensaje para el"}
            </span>
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "received"
                ? "Pega aqui el mensaje que recibiste..."
                : "Escribe lo que quieres enviarle..."
            }
            className="min-h-[120px] bg-bg-card border-0 text-white placeholder:text-zinc-500 resize-none rounded-none focus-visible:ring-0"
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-zinc-500">
          Ctrl/Cmd + Enter para procesar
        </p>
      </div>

      <AnimatePresence>
        {showOfflineWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-bg-danger border border-border-danger rounded-lg p-4 flex items-center gap-3"
          >
            <WifiOff className="w-5 h-5 text-accent-red flex-shrink-0" />
            <div>
              <p className="text-white text-sm font-medium">Sin conexion</p>
              <p className="text-zinc-400 text-xs">
                El simulador requiere internet para funcionar
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            PROCESAR
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}