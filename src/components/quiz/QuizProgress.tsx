"use client";

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-zinc-400 text-sm font-medium">
          Pregunta <span className="text-white font-semibold">{current}</span>{" "}
          <span className="text-zinc-600">de</span>{" "}
          <span className="text-zinc-300">{total}</span>
        </p>
        <p className="text-accent-gold text-sm font-mono font-semibold">
          {percentage}%
        </p>
      </div>

      <div
        className="relative w-full h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255, 255, 255, 0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #B8941F 0%, #D4AF37 50%, #fbbf24 100%)",
            boxShadow: "0 0 12px rgba(212, 175, 55, 0.4)",
          }}
        />
      </div>
    </div>
  );
}
