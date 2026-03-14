"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle } from "lucide-react";

interface ResetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { reason: string; cravingLevel: number }) => void;
}

const MAX_CHARS = 500;

export function ResetModal({ open, onOpenChange, onSubmit }: ResetModalProps) {
  const [reason, setReason] = useState("");
  const [cravingLevel, setCravingLevel] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setReason(value);
    }
  }, []);

  const handleSliderChange = useCallback((value: number | readonly number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setCravingLevel(newValue);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!reason.trim()) return;

    setIsSubmitting(true);
    
    try {
      onSubmit({
        reason: reason.trim(),
        cravingLevel,
      });
      
      setReason("");
      setCravingLevel(5);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [reason, cravingLevel, onSubmit, onOpenChange]);

  const getCravingColor = (level: number): string => {
    if (level <= 3) return "text-green-500";
    if (level <= 5) return "text-yellow-500";
    if (level <= 7) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bg-card border-border-default text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bg-danger border border-border-danger flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-accent-red" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg">
                Registrar Recaida
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm">
                Esto reiniciara tu streak a cero
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">
              Que paso?
            </label>
            <Textarea
              value={reason}
              onChange={handleReasonChange}
              placeholder="Describe brevemente que ocurrio..."
              className="bg-bg-primary border-border-default text-white placeholder:text-zinc-500 min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-zinc-500 text-right">
              {reason.length}/{MAX_CHARS}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-zinc-300">
                Nivel de ansiedad
              </label>
              <span className={`text-lg font-bold font-mono ${getCravingColor(cravingLevel)}`}>
                {cravingLevel}/10
              </span>
            </div>
            <Slider
              value={[cravingLevel]}
              onValueChange={handleSliderChange}
              min={1}
              max={10}
              step={1}
              className="w-full"
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Controlable</span>
              <span>Insoportable</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 rounded-lg border border-border-default text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
            className="flex-1 px-4 py-2 rounded-lg bg-btn-panic text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
            }}
          >
            {isSubmitting ? "Registrando..." : "Confirmar recaida"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}