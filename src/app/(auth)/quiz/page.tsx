"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { FakeLoading } from "@/components/quiz/FakeLoading";
import { QuizResult } from "@/components/quiz/QuizResult";
import { useQuiz } from "@/hooks/useQuiz";
import { QUIZ_QUESTIONS } from "@/lib/scoring/quiz-data";
import { Loader2, Clock, ArrowRight } from "lucide-react";

type QuizState = "quiz" | "mini-loading" | "fake-loading" | "result" | "cooldown";

interface QuizAnswer {
  questionId: string;
  optionId: string;
}

const MINI_LOADING_DURATION = 3000;
const MINI_LOADING_THRESHOLD = 10;

const MINI_LOADING_MESSAGES = [
  "Analizando patrones de respuesta...",
  "Detectando niveles de ansiedad...",
];

function CooldownTimer({ until, onGoToDashboard }: { until: string; onGoToDashboard: () => void }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = Date.now();
      const target = new Date(until).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Disponible ahora");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
      );
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [until]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto text-center space-y-6"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
        style={{
          background: "rgba(212, 175, 55, 0.08)",
          border: "2px solid rgba(212, 175, 55, 0.25)",
          boxShadow: "0 0 30px rgba(212, 175, 55, 0.15)",
        }}
      >
        <Clock className="w-8 h-8 text-accent-gold" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">Cuestionario en pausa</h2>
        <p className="text-zinc-400 text-sm">
          Ya completaste el cuestionario recientemente. Podras volver a realizarlo en:
        </p>
      </div>

      <p className="text-3xl font-bold font-mono text-accent-gold">
        {timeLeft}
      </p>

      <button
        onClick={onGoToDashboard}
        className="btn-premium px-8 py-3.5 text-base flex items-center gap-2"
      >
        Ir al Dashboard
        <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>
  );
}

function MiniLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < MINI_LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="mini-loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-4"
    >
      <Loader2 className="h-12 w-12 text-accent-gold animate-spin" />
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-300 text-sm font-medium"
        >
          {MINI_LOADING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState>("quiz");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showMiniLoading, setShowMiniLoading] = useState(false);

  const { isLoading, error, result, cooldownUntil, submitQuiz } = useQuiz();

  // Only redirect to dashboard if this is a fresh page load (not a retake)
  // The "retake" param is set when navigating from the dashboard button
  useEffect(() => {
    const isRetake = new URLSearchParams(window.location.search).has("retake");
    if (isRetake) return;

    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.onboarding_completed) {
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleAnswer = useCallback((optionId: string) => {
    const currentQuestion = QUIZ_QUESTIONS[currentStep];
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      optionId,
    };

    setAnswers((prev) => [...prev, newAnswer]);

    if (currentStep === QUIZ_QUESTIONS.length - 1) {
      setQuizState("fake-loading");
    } else if (currentStep === MINI_LOADING_THRESHOLD - 1) {
      setShowMiniLoading(true);
    } else {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 300);
    }
  }, [currentStep]);

  useEffect(() => {
    if (showMiniLoading) {
      const timeout = setTimeout(() => {
        setShowMiniLoading(false);
        setCurrentStep((prev) => prev + 1);
      }, MINI_LOADING_DURATION);

      return () => clearTimeout(timeout);
    }
  }, [showMiniLoading]);

  useEffect(() => {
    if (cooldownUntil) {
      setQuizState("cooldown");
    }
  }, [cooldownUntil]);

  const handleFakeLoadingComplete = useCallback(async () => {
    const success = await submitQuiz(answers);
    if (success) {
      setQuizState("result");
    }
  }, [answers, submitQuiz]);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const totalQuestions = QUIZ_QUESTIONS.length;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {quizState === "quiz" && !showMiniLoading && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-8"
          >
            <QuizProgress current={currentStep + 1} total={totalQuestions} />
            <QuizQuestion
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}

        {showMiniLoading && (
          <MiniLoading />
        )}

        {quizState === "fake-loading" && (
          <motion.div
            key="fake-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FakeLoading onComplete={handleFakeLoadingComplete} />
          </motion.div>
        )}

        {quizState === "cooldown" && cooldownUntil && (
          <motion.div
            key="cooldown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CooldownTimer
              until={cooldownUntil}
              onGoToDashboard={() => router.push("/dashboard")}
            />
          </motion.div>
        )}

        {quizState === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizResult result={result} />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-xl p-4"
          style={{
            background: "rgba(255, 59, 48, 0.08)",
            border: "1px solid rgba(255, 59, 48, 0.2)",
          }}
        >
          <p className="text-accent-red text-sm">{error}</p>
        </motion.div>
      )}

      {isLoading && quizState !== "fake-loading" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </motion.div>
      )}
    </div>
  );
}