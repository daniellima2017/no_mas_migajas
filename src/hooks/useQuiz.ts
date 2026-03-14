"use client";

import { useState, useCallback } from "react";
import type { QuizResult } from "@/lib/scoring/quiz-algorithm";

interface UseQuizReturn {
  isLoading: boolean;
  error: string | null;
  result: QuizResult | null;
  cooldownUntil: string | null;
  submitQuiz: (answers: { questionId: string; optionId: string }[]) => Promise<boolean>;
}

export function useQuiz(): UseQuizReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);

  const submitQuiz = useCallback(async (answers: { questionId: string; optionId: string }[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 && data.nextAttempt) {
          setCooldownUntil(data.nextAttempt);
          setError(data.error || "Ya completaste el cuestionario recientemente");
        } else {
          setError(data.error || "Error al procesar el cuestionario");
        }
        return false;
      }

      setResult(data.result);
      return true;
    } catch {
      setError("Error de conexion. Intenta nuevamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    result,
    cooldownUntil,
    submitQuiz,
  };
}
