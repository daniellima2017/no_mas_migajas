"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Medal, EliteAdvice, MedalType } from "@/types";

interface MedalThreshold {
  type: MedalType;
  seconds: number;
  label: string;
}

const MEDAL_THRESHOLDS: MedalThreshold[] = [
  { type: "bronze_12h" as MedalType, seconds: 12 * 60 * 60, label: "Bronce (12h)" },
  { type: "silver_24h" as MedalType, seconds: 24 * 60 * 60, label: "Plata (24h)" },
  { type: "gold_3d" as MedalType, seconds: 3 * 24 * 60 * 60, label: "Oro (3d)" },
  { type: "diamond_7d" as MedalType, seconds: 7 * 24 * 60 * 60, label: "Diamante (7d)" },
  { type: "dignity_21d" as MedalType, seconds: 21 * 24 * 60 * 60, label: "Dignidad (21d)" },
];

interface UseMedalsReturn {
  medals: Medal[];
  isLoading: boolean;
  error: string | null;
  getMedals: () => Promise<void>;
  checkNewMedals: (streakSeconds: number) => Promise<Medal | null>;
  getEliteAdvice: (medalType: string) => Promise<EliteAdvice | null>;
}

export function useMedals(): UseMedalsReturn {
  const [medals, setMedals] = useState<Medal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMedals = useCallback(async () => {
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
        .from("medals")
        .select("*")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: true });

      if (fetchError) {
        console.error("Error obteniendo medallas:", fetchError);
        setError("No se pudieron obtener las medallas");
        return;
      }

      setMedals(data || []);
    } catch {
      setError("Error de conexion");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkNewMedals = useCallback(async (streakSeconds: number): Promise<Medal | null> => {
    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data: existingMedals } = await supabase
        .from("medals")
        .select("medal_type")
        .eq("user_id", user.id);

      const existingTypes = new Set(existingMedals?.map((m) => m.medal_type) || []);

      for (const threshold of MEDAL_THRESHOLDS) {
        if (streakSeconds >= threshold.seconds && !existingTypes.has(threshold.type)) {
          const { data: newMedal, error: insertError } = await supabase
            .from("medals")
            .insert({
              user_id: user.id,
              medal_type: threshold.type,
            })
            .select()
            .single();

          if (insertError) {
            if (insertError.code === "23505") {
              continue;
            }
            console.error("Error insertando medalla:", insertError);
            continue;
          }

          if (newMedal) {
            setMedals((prev) => [...prev, newMedal]);
            return newMedal;
          }
        }
      }

      return null;
    } catch {
      console.error("Error verificando medallas");
      return null;
    }
  }, []);

  const getEliteAdvice = useCallback(async (medalType: string): Promise<EliteAdvice | null> => {
    try {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from("elite_advices")
        .select("*")
        .eq("medal_type", medalType)
        .single();

      if (fetchError) {
        console.error("Error obteniendo consejo elite:", fetchError);
        return null;
      }

      return data;
    } catch {
      console.error("Error de conexion al obtener consejo");
      return null;
    }
  }, []);

  return {
    medals,
    isLoading,
    error,
    getMedals,
    checkNewMedals,
    getEliteAdvice,
  };
}