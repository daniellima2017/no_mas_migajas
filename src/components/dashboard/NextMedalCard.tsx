"use client";

import { Clock, Shield, Award, Crown, Diamond, Star } from "lucide-react";

interface NextMedalCardProps {
  streakSeconds: number;
}

interface MedalThreshold {
  type: string;
  seconds: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MEDAL_THRESHOLDS: MedalThreshold[] = [
  { type: "bronze_12h", seconds: 12 * 60 * 60, label: "Bronce (12h)", icon: Shield },
  { type: "silver_24h", seconds: 24 * 60 * 60, label: "Plata (24h)", icon: Award },
  { type: "gold_3d", seconds: 3 * 24 * 60 * 60, label: "Oro (3 dias)", icon: Crown },
  { type: "diamond_7d", seconds: 7 * 24 * 60 * 60, label: "Diamante (7 dias)", icon: Diamond },
  { type: "dignity_21d", seconds: 21 * 24 * 60 * 60, label: "Dignidad (21 dias)", icon: Star },
];

function formatTimeRemaining(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) return `${days}d ${remainingHours}h`;
  return `${hours}h`;
}

function getNextMedal(streakSeconds: number): MedalThreshold | null {
  for (const medal of MEDAL_THRESHOLDS) {
    if (streakSeconds < medal.seconds) return medal;
  }
  return null;
}

export function NextMedalCard({ streakSeconds }: NextMedalCardProps) {
  const nextMedal = getNextMedal(streakSeconds);

  if (!nextMedal) {
    return (
      <div className="glass-card p-4 glow-gold">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #D4AF37, #92750f)" }}
          >
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-zinc-500 text-[11px] uppercase tracking-wider font-medium">Medallas</p>
            <p className="text-accent-gold text-sm font-bold mt-0.5 text-glow-gold">Coleccion completa</p>
          </div>
        </div>
      </div>
    );
  }

  const remainingSeconds = nextMedal.seconds - streakSeconds;
  const remainingFormatted = formatTimeRemaining(remainingSeconds);
  const progressPercent = Math.min(100, (streakSeconds / nextMedal.seconds) * 100);
  const IconComponent = nextMedal.icon;

  return (
    <div className="glass-card-hover p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(212, 175, 55, 0.1)" }}
        >
          <IconComponent className="w-5 h-5 text-accent-gold" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-zinc-500 text-[11px] uppercase tracking-wider font-medium">
            Proxima medalla
          </p>
          <p className="text-white text-sm mt-0.5">
            Faltan <span className="text-accent-gold font-bold font-mono">{remainingFormatted}</span>
          </p>

          <div className="mt-2.5 w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #D4AF37, #fbbf24)",
                boxShadow: "0 0 8px rgba(212, 175, 55, 0.3)",
              }}
            />
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <Clock className="w-4 h-4 text-zinc-600 mx-auto" />
          <p className="text-xs text-accent-gold font-mono font-semibold mt-1">
            {Math.round(progressPercent)}%
          </p>
        </div>
      </div>
    </div>
  );
}
