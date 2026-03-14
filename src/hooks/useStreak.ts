"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Streak } from "@/types";

interface UseStreakReturn {
  streak: Streak | null;
  isLoading: boolean;
  error: string | null;
  getStreak: () => Promise<void>;
  resetStreak: (reason: string, cravingLevel: number) => Promise<boolean>;
}

export function useStreak(): UseStreakReturn {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStreak = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("Usuario no autenticado");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (fetchError) {
        console.error("Error obteniendo streak:", fetchError);
        setError("No se pudo obtener el streak");
        return;
      }

      setStreak(data);
    } catch {
      setError("Error de conexion");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetStreak = useCallback(async (reason: string, cravingLevel: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/streak/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason,
          cravingLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al registrar la recaida");
        return false;
      }

      await getStreak();

      return true;
    } catch {
      setError("Error de conexion");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getStreak]);

  return {
    streak,
    isLoading,
    error,
    getStreak,
    resetStreak,
  };
}