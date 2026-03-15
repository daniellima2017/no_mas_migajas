"use client";

import { useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { JournalEntry } from "@/types";

interface SaveResponse {
  message: string;
  entry_id: string;
  created_at: string;
}

interface UseJournalReturn {
  entryId: string | null;
  feedback: string;
  isSaving: boolean;
  isLoadingFeedback: boolean;
  error: string | null;
  history: JournalEntry[];
  isLoadingHistory: boolean;
  save: (content: string) => Promise<string | null>;
  requestFeedback: (content: string, entryId?: string) => Promise<void>;
  getHistory: () => Promise<void>;
  reset: () => void;
}

export function useJournal(): UseJournalReturn {
  const [entryId, setEntryId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<JournalEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const saveRequestInProgressRef = useRef(false);

  const save = useCallback(async (content: string): Promise<string | null> => {
    if (saveRequestInProgressRef.current) {
      return null;
    }

    setIsSaving(true);
    setError(null);
    saveRequestInProgressRef.current = true;

    try {
      const response = await fetch("/api/journal/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Error al guardar la entrada");
        return null;
      }

      const data: SaveResponse = await response.json();
      setEntryId(data.entry_id);
      return data.entry_id;
    } catch {
      setError("Error de conexion");
      return null;
    } finally {
      setIsSaving(false);
      saveRequestInProgressRef.current = false;
    }
  }, []);

  const requestFeedback = useCallback(
    async (content: string, existingEntryId?: string): Promise<void> => {
      setError(null);
      setFeedback("");
      setIsLoadingFeedback(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/journal/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            entry_id: existingEntryId || entryId,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Error al obtener feedback");
          setIsLoadingFeedback(false);
          return;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          setError("Error leyendo respuesta");
          setIsLoadingFeedback(false);
          return;
        }

        let fullFeedback = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullFeedback += chunk;
          setFeedback(fullFeedback);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError("Error de conexion");
      } finally {
        setIsLoadingFeedback(false);
      }
    },
    [entryId]
  );

  const getHistory = useCallback(async (): Promise<void> => {
    setIsLoadingHistory(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoadingHistory(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) {
        setError("Error al obtener el historial");
        setIsLoadingHistory(false);
        return;
      }

      setHistory(data || []);
    } catch {
      setError("Error de conexion");
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEntryId(null);
    setFeedback("");
    setError(null);
  }, []);

  return {
    entryId,
    feedback,
    isSaving,
    isLoadingFeedback,
    error,
    history,
    isLoadingHistory,
    save,
    requestFeedback,
    getHistory,
    reset,
  };
}