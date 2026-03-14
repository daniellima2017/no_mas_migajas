"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PenLine, Loader2, Save } from "lucide-react";

interface JournalInputProps {
  onSubmit: (content: string) => void;
  onAutoSave?: (content: string) => void;
  isLoading: boolean;
  initialContent?: string;
}

const DEBOUNCE_MS = 2000;
const MAX_LENGTH = 5000;

export function JournalInput({
  onSubmit,
  onAutoSave,
  isLoading,
  initialContent = "",
}: JournalInputProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [charCount, setCharCount] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef(initialContent);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  useEffect(() => {
    if (content === lastSavedContentRef.current || !onAutoSave) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (content.trim()) {
        setIsSaving(true);
        await onAutoSave(content);
        lastSavedContentRef.current = content;
        setLastSaved(new Date());
        setIsSaving(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [content, onAutoSave]);

  const handleSubmit = useCallback(() => {
    if (content.trim() && !isLoading) {
      onSubmit(content.trim());
    }
  }, [content, isLoading, onSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setContent(value);
    }
  }, []);

  const formatLastSaved = (date: Date): string => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          <PenLine className="w-4 h-4" />
          <span className="text-sm">Tu diario privado</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : lastSaved ? (
            <>
              <Save className="w-3 h-3" />
              <span>Guardado a las {formatLastSaved(lastSaved)}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="relative">
        <Textarea
          value={content}
          onChange={handleChange}
          placeholder="Escribelo aqui, NO a el"
          className="min-h-[300px] bg-bg-card border-border-default text-white placeholder:text-zinc-500 resize-none text-base leading-relaxed"
          disabled={isLoading}
        />
        <div className="absolute bottom-3 right-3 text-xs text-zinc-600">
          {charCount}/{MAX_LENGTH}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          Lo que escribas aqui es solo para ti. Nadie mas lo vera.
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="bg-white text-black hover:bg-zinc-200 font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            "Analizar Desahogo"
          )}
        </Button>
      </div>
    </div>
  );
}