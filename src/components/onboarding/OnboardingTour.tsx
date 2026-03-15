"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";

export interface TourStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface OnboardingTourProps {
  tourKey: string;
  steps: TourStep[];
}

export function OnboardingTour({ tourKey, steps }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(`tour_${tourKey}`);
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [tourKey]);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(`tour_${tourKey}`, "1");
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-6"
        style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(4px)" }}
        onClick={dismiss}
      >
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm rounded-2xl p-6 space-y-5"
          style={{
            background: "linear-gradient(135deg, rgba(20, 20, 25, 0.98), rgba(15, 15, 20, 0.98))",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            boxShadow: "0 0 40px rgba(212, 175, 55, 0.1), 0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-gold/60">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <button
              onClick={dismiss}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                boxShadow: "0 0 20px rgba(212, 175, 55, 0.1)",
              }}
            >
              {step.icon}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentStep ? 20 : 8,
                    background:
                      i === currentStep
                        ? "rgba(212, 175, 55, 0.8)"
                        : i < currentStep
                          ? "rgba(212, 175, 55, 0.3)"
                          : "rgba(255, 255, 255, 0.1)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: "rgba(212, 175, 55, 0.15)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                color: "#D4AF37",
              }}
            >
              {isLast ? "Entendido" : "Siguiente"}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
