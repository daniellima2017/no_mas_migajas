"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Loader2, WifiOff } from "lucide-react";
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
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as "received" | "sending")}
      >
        <TabsList className="w-full bg-zinc-900 border border-border-default">
          <TabsTrigger
            value="received"
            className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            Que te dijo?
          </TabsTrigger>
          <TabsTrigger
            value="sending"
            className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            Que quieres mandarle?
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === "received"
              ? "Pega aqui el mensaje que recibiste..."
              : "Escribe lo que quieres enviarle..."
          }
          className="min-h-[120px] bg-bg-card border-border-default text-white placeholder:text-zinc-500 resize-none"
          disabled={isLoading}
        />
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