"use client";

import { useState, useCallback, useRef } from "react";

interface PanicResponse {
  default_response: string;
  blocked_until: string;
  block_duration_minutes: number;
}

interface UseSimulatorReturn {
  response: string;
  isLoading: boolean;
  error: string | null;
  classification: string | null;
  panicResponse: PanicResponse | null;
  analyze: (text: string, mode: "received" | "sending") => Promise<void>;
  panic: () => Promise<void>;
  reset: () => void;
}

export function useSimulator(): UseSimulatorReturn {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [panicResponse, setPanicResponse] = useState<PanicResponse | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const analyze = useCallback(
    async (text: string, mode: "received" | "sending") => {
      setError(null);
      setClassification(null);
      setPanicResponse(null);
      setResponse("");
      setIsLoading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch("/api/simulator/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, mode }),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error procesando el mensaje");
          setIsLoading(false);
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          setError("Error leyendo respuesta");
          setIsLoading(false);
          return;
        }

        // Delay initial to give "processing" feel
        await new Promise((resolve) => setTimeout(resolve, 1500));

        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setResponse(fullResponse);

          // Small delay between chunks for typewriter effect
          await new Promise((resolve) => setTimeout(resolve, 30));
        }

        const classificationMatch = fullResponse.match(/\[([A-Z\s]+)\]/);
        if (classificationMatch) {
          setClassification(classificationMatch[1].trim());
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError("Error de conexion");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const panic = useCallback(async () => {
    setError(null);
    setClassification(null);
    setResponse("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/simulator/panic", {
        method: "POST",
      });

      if (!response.ok) {
        setError("Error en el boton de panico");
        setIsLoading(false);
        return;
      }

      const data: PanicResponse = await response.json();

      setPanicResponse(data);
      setResponse(data.default_response);
    } catch {
      setError("Error de conexion");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResponse("");
    setError(null);
    setClassification(null);
    setPanicResponse(null);
  }, []);

  return {
    response,
    isLoading,
    error,
    classification,
    panicResponse,
    analyze,
    panic,
    reset,
  };
}