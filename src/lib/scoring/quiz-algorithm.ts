import { QUIZ_QUESTIONS } from "./quiz-data";

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizResult {
  score: number;
  rawPoints: number;
  verdict: string;
  level: string;
  color: "green" | "yellow" | "orange" | "red";
}

const MAX_POINTS = 150;

const VERDICT_LEVELS = {
  dignidad: {
    minPoints: 0,
    maxPoints: 35,
    level: "Dignidad Estable",
    verdict: "Tu dignidad esta intacta. Tienes el control de tu vida emocional.",
    color: "green" as const,
  },
  alerta: {
    minPoints: 36,
    maxPoints: 75,
    level: "Alerta de Desequilibrio",
    verdict: "Hay senales de inestabilidad. Presta atencion a tus patrones.",
    color: "yellow" as const,
  },
  migajas: {
    minPoints: 76,
    maxPoints: 115,
    level: "Zona de Migajas",
    verdict: "Estas atrapada en un ciclo de migajas emocionales. Necesitas cambiar.",
    color: "orange" as const,
  },
  mendicidad: {
    minPoints: 116,
    maxPoints: 150,
    level: "Mendicidad Emocional",
    verdict: "Tu autoestima esta en crisis. Es hora de una intervencion seria.",
    color: "red" as const,
  },
};

export function calculateScore(answers: QuizAnswer[]): QuizResult {
  let rawPoints = 0;

  for (const answer of answers) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const option = question.options.find((opt) => opt.id === answer.optionId);
    if (!option) continue;

    rawPoints += option.points;
  }

  const score = Math.round((rawPoints / MAX_POINTS) * 100);

  let verdictData;
  if (rawPoints <= VERDICT_LEVELS.dignidad.maxPoints) {
    verdictData = VERDICT_LEVELS.dignidad;
  } else if (rawPoints <= VERDICT_LEVELS.alerta.maxPoints) {
    verdictData = VERDICT_LEVELS.alerta;
  } else if (rawPoints <= VERDICT_LEVELS.migajas.maxPoints) {
    verdictData = VERDICT_LEVELS.migajas;
  } else {
    verdictData = VERDICT_LEVELS.mendicidad;
  }

  return {
    score,
    rawPoints,
    verdict: verdictData.verdict,
    level: verdictData.level,
    color: verdictData.color,
  };
}

export function getVerdictColor(color: QuizResult["color"]): string {
  const colors = {
    green: "#22c55e",
    yellow: "#eab308",
    orange: "#f97316",
    red: "#ef4444",
  };
  return colors[color];
}

export function getVerdictBgColor(color: QuizResult["color"]): string {
  const colors = {
    green: "rgba(34, 197, 94, 0.2)",
    yellow: "rgba(234, 179, 8, 0.2)",
    orange: "rgba(249, 115, 22, 0.2)",
    red: "rgba(239, 68, 68, 0.2)",
  };
  return colors[color];
}