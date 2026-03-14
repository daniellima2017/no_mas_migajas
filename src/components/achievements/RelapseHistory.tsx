"use client";

import { motion } from "framer-motion";
import { Calendar, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Relapse, TriggerPatterns } from "@/types";

interface RelapseHistoryProps {
  relapses: Relapse[];
  triggerPatterns: TriggerPatterns | null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h`;
}

function getCravingColor(level: number): string {
  if (level <= 3) return "text-green-500";
  if (level <= 5) return "text-yellow-500";
  if (level <= 7) return "text-orange-500";
  return "text-red-500";
}

function getCravingBg(level: number): string {
  if (level <= 3) return "bg-green-500/10 border-green-500/30";
  if (level <= 5) return "bg-yellow-500/10 border-yellow-500/30";
  if (level <= 7) return "bg-orange-500/10 border-orange-500/30";
  return "bg-red-500/10 border-red-500/30";
}

export function RelapseHistory({ relapses, triggerPatterns }: RelapseHistoryProps) {
  const hasRelapses = relapses.length > 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-zinc-400 text-sm uppercase tracking-wider">
          Historial de Recaidas
        </h3>
        {hasRelapses && (
          <span className="text-zinc-500 text-xs">
            {relapses.length} registro{relapses.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {triggerPatterns && triggerPatterns.craving_threshold && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-danger border border-border-danger rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent-red" />
              </div>
            </div>
            <div>
              <p className="text-zinc-300 text-sm font-medium mb-1">
                Insight Automatico
              </p>
              <p className="text-zinc-400 text-sm">
                Sueles recaer cuando tu ansiedad supera{" "}
                <span className="text-accent-red font-bold">
                  {triggerPatterns.craving_threshold.toFixed(1)}
                </span>
              </p>
              {triggerPatterns.most_common_hour !== null && (
                <p className="text-zinc-500 text-xs mt-2">
                  Hora critica habitual:{" "}
                  <span className="text-white font-mono">
                    {triggerPatterns.most_common_hour}:00
                  </span>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {!hasRelapses ? (
        <Card className="bg-bg-card border-border-default p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Calendar className="w-10 h-10 text-zinc-600 mb-3" />
            <p className="text-zinc-400 text-sm">
              Sin recaidas registradas
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              Manten tu racha para ver tu progreso aqui
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {relapses
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map((relapse, index) => (
              <motion.div
                key={relapse.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-bg-card border-border-default p-4 hover:border-zinc-600 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(relapse.created_at)}</span>
                        {relapse.streak_duration_seconds !== null && (
                          <>
                            <span className="text-zinc-600">|</span>
                            <Clock className="w-3 h-3" />
                            <span>
                              Streak: {formatDuration(relapse.streak_duration_seconds)}
                            </span>
                          </>
                        )}
                      </div>

                      {relapse.reason ? (
                        <p className="text-zinc-300 text-sm leading-relaxed">
                          {relapse.reason}
                        </p>
                      ) : (
                        <p className="text-zinc-600 text-sm italic">
                          Sin motivo especificado
                        </p>
                      )}
                    </div>

                    {relapse.craving_level !== null && (
                      <div
                        className={`
                          flex-shrink-0 px-3 py-1.5 rounded-lg border
                          ${getCravingBg(relapse.craving_level)}
                        `}
                      >
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle
                            className={`w-3.5 h-3.5 ${getCravingColor(relapse.craving_level)}`}
                          />
                          <span
                            className={`text-sm font-mono font-bold ${getCravingColor(relapse.craving_level)}`}
                          >
                            {relapse.craving_level}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-xs text-center mt-0.5">
                          ansiedad
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      )}
    </div>
  );
}