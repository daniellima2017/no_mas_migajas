"use client";

interface StreakProgressBarProps {
  currentSeconds: number;
}

interface Milestone {
  label: string;
  seconds: number;
}

const MILESTONES: Milestone[] = [
  { label: "12h", seconds: 12 * 60 * 60 },
  { label: "24h", seconds: 24 * 60 * 60 },
  { label: "3d", seconds: 3 * 24 * 60 * 60 },
  { label: "7d", seconds: 7 * 24 * 60 * 60 },
  { label: "21d", seconds: 21 * 24 * 60 * 60 },
];

function getNextMilestone(currentSeconds: number): Milestone | null {
  for (const m of MILESTONES) {
    if (currentSeconds < m.seconds) return m;
  }
  return null;
}

function getOverallPercentage(currentSeconds: number): number {
  const maxSeconds = MILESTONES[MILESTONES.length - 1].seconds;
  return Math.min(100, Math.max(0, (currentSeconds / maxSeconds) * 100));
}

function formatTimeRemaining(seconds: number, currentSeconds: number): string {
  const remaining = seconds - currentSeconds;
  if (remaining <= 0) return "Completado";

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h restantes`;
  }
  return `${hours}h ${minutes}m restantes`;
}

export function StreakProgressBar({ currentSeconds }: StreakProgressBarProps) {
  const next = getNextMilestone(currentSeconds);
  const overallPercentage = getOverallPercentage(currentSeconds);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-zinc-400 text-sm">
          Proxima medalla:{" "}
          <span className="text-accent-gold font-bold">{next?.label || "Completado"}</span>
        </p>
        {next && (
          <p className="text-zinc-500 text-xs font-mono">
            {formatTimeRemaining(next.seconds, currentSeconds)}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${overallPercentage}%`,
            background: "linear-gradient(90deg, #B8941F 0%, #D4AF37 50%, #fbbf24 100%)",
            boxShadow: "0 0 12px rgba(212, 175, 55, 0.4)",
          }}
        />

        {/* Milestone dots */}
        {MILESTONES.map((milestone) => {
          const position = (milestone.seconds / MILESTONES[MILESTONES.length - 1].seconds) * 100;
          const isCompleted = currentSeconds >= milestone.seconds;

          return (
            <div
              key={milestone.label}
              className="absolute top-1/2 w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                left: `${position}%`,
                transform: "translate(-50%, -50%)",
                background: isCompleted ? "#D4AF37" : "rgba(255,255,255,0.1)",
                border: isCompleted ? "2px solid #fbbf24" : "2px solid rgba(255,255,255,0.15)",
                boxShadow: isCompleted ? "0 0 8px rgba(212, 175, 55, 0.5)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between px-0.5">
        {MILESTONES.map((milestone) => {
          const isCompleted = currentSeconds >= milestone.seconds;
          const isCurrent = next?.label === milestone.label;

          return (
            <span
              key={milestone.label}
              className={`text-[11px] font-medium transition-colors ${
                isCompleted
                  ? "text-accent-gold"
                  : isCurrent
                  ? "text-white"
                  : "text-zinc-600"
              }`}
            >
              {milestone.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
