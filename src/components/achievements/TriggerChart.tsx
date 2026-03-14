"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";
import type { TriggerPatterns, Relapse } from "@/types";

interface TriggerChartProps {
  relapses: Relapse[];
  triggerPatterns: TriggerPatterns | null;
}

interface HourData {
  hour: string;
  count: number;
}

interface CravingData {
  level: string;
  count: number;
}

const CHART_COLORS = {
  gold: "#D4AF37",
  red: "#FF3B30",
  orange: "#F97316",
  background: "#09090b",
  border: "#27272a",
  text: "#a1a1aa",
};

function processHourlyData(relapses: Relapse[]): HourData[] {
  const hourCounts: Record<number, number> = {};

  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  relapses.forEach((relapse) => {
    const hour = new Date(relapse.created_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  return Object.entries(hourCounts).map(([hour, count]) => ({
    hour: `${hour}h`,
    count,
  }));
}

function processCravingData(relapses: Relapse[]): CravingData[] {
  const levelCounts: Record<number, number> = {};

  relapses.forEach((relapse) => {
    if (relapse.craving_level) {
      levelCounts[relapse.craving_level] = (levelCounts[relapse.craving_level] || 0) + 1;
    }
  });

  return Object.entries(levelCounts)
    .map(([level, count]) => ({
      level: `Nivel ${level}`,
      count,
    }))
    .sort((a, b) => {
      const levelA = parseInt(a.level.replace("Nivel ", ""));
      const levelB = parseInt(b.level.replace("Nivel ", ""));
      return levelA - levelB;
    });
}

function getBarColor(count: number, maxCount: number): string {
  const ratio = maxCount > 0 ? count / maxCount : 0;

  if (ratio > 0.7) return CHART_COLORS.red;
  if (ratio > 0.4) return CHART_COLORS.orange;
  return CHART_COLORS.gold;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm shadow-lg"
      style={{
        background: "rgba(9, 9, 11, 0.95)",
        border: "1px solid rgba(212, 175, 55, 0.3)",
      }}
    >
      <p className="text-zinc-400 text-xs">{label}</p>
      <p className="text-white font-mono font-bold">{payload[0].value}</p>
    </div>
  );
}

export function TriggerChart({ relapses, triggerPatterns }: TriggerChartProps) {
  const hourlyData = useMemo(() => processHourlyData(relapses), [relapses]);
  const cravingData = useMemo(() => processCravingData(relapses), [relapses]);

  const hasRelapses = relapses.length > 0;
  const maxHourCount = Math.max(...hourlyData.map((d) => d.count));
  const maxCravingCount = Math.max(...cravingData.map((d) => d.count));

  if (!hasRelapses) {
    return (
      <div className="w-full">
        <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-4">
          Patrones de Recaida
        </h3>

        <div className="bg-bg-card border border-border-default rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
          <BarChart3 className="w-10 h-10 text-zinc-600 mb-3" />
          <p className="text-zinc-500 text-sm">
            Datos insuficientes para analisis
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            Registra recaidas para ver patrones
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h3 className="text-zinc-400 text-sm uppercase tracking-wider">
        Patrones de Recaida
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bg-card border border-border-default rounded-lg p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">
            Horas Criticas
          </p>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData.filter((d) => d.count > 0)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.border}
                  vertical={false}
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: CHART_COLORS.text, fontSize: 10 }}
                  axisLine={{ stroke: CHART_COLORS.border }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: CHART_COLORS.text, fontSize: 10 }}
                  axisLine={{ stroke: CHART_COLORS.border }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(212, 175, 55, 0.08)" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {hourlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.count, maxHourCount)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-card border border-border-default rounded-lg p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">
            Niveles de Ansiedad
          </p>
          <div className="h-[180px]">
            {cravingData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cravingData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.border}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="level"
                    tick={{ fill: CHART_COLORS.text, fontSize: 10 }}
                    axisLine={{ stroke: CHART_COLORS.border }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: CHART_COLORS.text, fontSize: 10 }}
                    axisLine={{ stroke: CHART_COLORS.border }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(212, 175, 55, 0.08)" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {cravingData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(entry.count, maxCravingCount)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-zinc-600 text-sm">
                  Sin datos de ansiedad
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {triggerPatterns && (
        <div className="bg-bg-card border border-border-default rounded-lg p-4">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">
            Resumen
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white font-mono">
                {relapses.length}
              </p>
              <p className="text-zinc-500 text-xs">Recaidas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent-gold font-mono">
                {triggerPatterns.avg_craving?.toFixed(1) || "-"}
              </p>
              <p className="text-zinc-500 text-xs">Ansiedad Promedio</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">
                {triggerPatterns.most_common_hour !== null ? `${triggerPatterns.most_common_hour}h` : "-"}
              </p>
              <p className="text-zinc-500 text-xs">Hora Critica</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono truncate text-sm px-2">
                {triggerPatterns.most_common_reason || "-"}
              </p>
              <p className="text-zinc-500 text-xs">Motivo Frecuente</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}