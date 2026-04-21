"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { JournalInput } from "@/components/journal/JournalInput";
import { JournalFeedback } from "@/components/journal/JournalFeedback";
import { useJournal } from "@/hooks/useJournal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  UserCircle2,
} from "lucide-react";
import type { JournalEntry } from "@/types";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function JournalHistoryItem({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: JournalEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="bg-bg-card border-border-default overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-300">{formatDate(entry.created_at)}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-zinc-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        )}
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border-default"
        >
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                Tu desahogo
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {entry.content}
              </p>
            </div>

            {entry.ai_feedback && (
              <div className="border-t border-border-default pt-4">
                <p className="text-xs text-accent-gold uppercase tracking-wider mb-2">
                  Choque de realidad
                </p>
                <p className="text-white text-sm leading-relaxed">
                  {entry.ai_feedback}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </Card>
  );
}

export default function JournalPage() {
  const {
    entryId,
    feedback,
    isLoadingFeedback,
    error,
    history,
    isLoadingHistory,
    save,
    requestFeedback,
    getHistory,
    reset,
  } = useJournal();

  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  const handleSubmit = useCallback(
    async (content: string) => {
      let currentEntryId = entryId;

      if (!currentEntryId) {
        currentEntryId = await save(content);
      }

      if (currentEntryId || entryId) {
        await requestFeedback(content, currentEntryId || undefined);
      }
    },
    [entryId, save, requestFeedback]
  );

  const handleAutoSave = useCallback(
    async (content: string) => {
      if (!entryId) {
        await save(content);
      }
    },
    [entryId, save]
  );

  const handleToggleEntry = useCallback((id: string) => {
    setExpandedEntryId((prev) => (prev === id ? null : id));
  }, []);

  const handleNewEntry = useCallback(() => {
    reset();
    setExpandedEntryId(null);
  }, [reset]);

  return (
    <div className="min-h-screen bg-bg-primary p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6 text-accent-gold" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Diario + IA
              </h1>
            </div>
            <p className="text-zinc-400 text-sm">
              Descarga lo que sientes y deja que el sistema te devuelva una lectura mas clara
            </p>
          </div>

          <Link
            href="/profile"
            className="rounded-2xl px-3 py-2 text-zinc-300 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="flex items-center gap-2 text-sm">
              <UserCircle2 className="w-4 h-4 text-accent-gold" />
              Perfil
            </span>
          </Link>
        </div>

        <div className="space-y-6">
          <JournalInput
            onSubmit={handleSubmit}
            onAutoSave={handleAutoSave}
            isLoading={isLoadingFeedback}
          />

          <JournalFeedback feedback={feedback} isLoading={isLoadingFeedback} />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-bg-danger border-border-danger p-4">
                <p className="text-accent-red text-sm">{error}</p>
              </Card>
            </motion.div>
          )}

          {feedback && !isLoadingFeedback && (
            <div className="flex justify-center">
              <Button
                onClick={handleNewEntry}
                variant="outline"
                className="border-border-default text-zinc-300 hover:bg-zinc-800"
              >
                Nueva entrada
              </Button>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-border-default">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-zinc-400 text-sm uppercase tracking-wider">
              Historial
            </h2>
            {history.length > 0 && (
              <span className="text-zinc-500 text-xs">
                {history.length} entrada{history.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-2">
              {history.map((entry) => (
                <JournalHistoryItem
                  key={entry.id}
                  entry={entry}
                  isExpanded={expandedEntryId === entry.id}
                  onToggle={() => handleToggleEntry(entry.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-bg-card border-border-default p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <BookOpen className="w-10 h-10 text-zinc-600 mb-3" />
                <p className="text-zinc-400 text-sm">
                  Sin entradas anteriores
                </p>
                <p className="text-zinc-600 text-xs mt-1">
                  Tu primera entrada aparecera aqui
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="pt-8 border-t border-border-default">
          <div className="grid gap-3 text-sm text-zinc-500">
            <p className="text-center">
              Este diario es completamente privado.
            </p>
            <p className="text-center">
              Solo tu puedes ver lo que escribes aqui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
