"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Eye,
  Search,
  Smartphone,
  UserX,
  Sun,
  Cloud,
  Brain,
  Clock,
  AlertCircle,
  Trash2,
  Archive,
  Image,
  FolderOpen,
  Heart,
  X,
  HelpCircle,
  MessageCircle,
  Zap,
  Sparkles,
  Smile,
  Meh,
  Shuffle,
  Frown,
  CloudRain,
  CheckCircle,
  RefreshCw,
  Calendar,
  AlertTriangle,
  XCircle,
  Users,
  GitCompare,
  Link,
  BarChart,
  Lock,
  HeartHandshake,
  UserCheck,
  UserMinus,
  DoorClosed,
  Moon,
  Bed,
  ShieldCheck,
  Feather,
  Wind,
  Flame,
  Ban,
  Lightbulb,
  EyeOff,
  Scan,
  Send,
  BookOpen,
  RotateCcw,
  CircleAlert,
  Crown,
  TrendingUp,
  Scale,
  ArrowDown,
  Droplet,
  CheckCircle2,
  Loader,
  CircleDot,
  CircleHelp,
  MessageSquareWarning,
  type LucideIcon,
} from "lucide-react";
import type { QuizQuestion as QuizQuestionType, QuizOption } from "@/lib/scoring/quiz-data";

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (optionId: string) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Shield,
  Eye,
  Search,
  Smartphone,
  Stalker: UserX,
  Sun,
  Cloud,
  Brain,
  Clock,
  AlertCircle,
  Trash2,
  Archive,
  Image,
  FolderOpen,
  Heart,
  X,
  HelpCircle,
  MessageCircle,
  Zap,
  Sparkles,
  Smile,
  Meh,
  Shuffle,
  Frown,
  CloudRain,
  CheckCircle,
  RefreshCw,
  Calendar,
  AlertTriangle,
  XCircle,
  Users,
  GitCompare,
  Link,
  BarChart,
  Lock,
  HeartHandshake,
  UserCheck,
  UserX,
  UserMinus,
  DoorClosed,
  Moon,
  CloudMoon: Moon,
  Dream: Moon,
  Bed,
  Skull: AlertTriangle,
  ShieldCheck,
  Feather,
  Wind,
  Flame,
  Siren: AlertTriangle,
  Ban,
  Lightbulb,
  Candle: Lightbulb,
  Sparkle: Sparkles,
  Infinite: Clock,
  EyeOff,
  Scan,
  Send,
  BookOpen,
  RotateCcw,
  CircleAlert,
  Crown,
  TrendingUp,
  Scale,
  ArrowDown,
  Droplet,
  CheckCircle2,
  Loader,
  CircleDashed: CircleDot,
  QuestionMark: CircleHelp,
  MessageSquareWarning,
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function DynamicIcon({ name }: { name: string }) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return <HelpCircle className="h-5 w-5" />;
  }

  return <IconComponent className="h-5 w-5" />;
}

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  selected: {
    scale: [1, 1.02, 1, 1.02, 1],
    transition: { duration: 0.4, times: [0, 0.25, 0.5, 0.75, 1] },
  },
  exit: { opacity: 0, y: -10, scale: 0.95 },
};

const pulseVariants = {
  initial: { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0)" },
  pulse: {
    boxShadow: [
      "0 0 0 0 rgba(212, 175, 55, 0.4)",
      "0 0 0 8px rgba(212, 175, 55, 0)",
      "0 0 0 0 rgba(212, 175, 55, 0)",
    ],
    transition: { duration: 0.6, times: [0, 0.5, 1] },
  },
};

function getSelectedStyles(option: QuizOption): { border: string; bg: string; glow: string } {
  switch (option.points) {
    case 0:
      return { border: "rgba(34, 197, 94, 0.6)", bg: "rgba(34, 197, 94, 0.1)", glow: "0 0 20px rgba(34, 197, 94, 0.2)" };
    case 3:
      return { border: "rgba(16, 185, 129, 0.6)", bg: "rgba(16, 185, 129, 0.1)", glow: "0 0 20px rgba(16, 185, 129, 0.2)" };
    case 5:
      return { border: "rgba(234, 179, 8, 0.6)", bg: "rgba(234, 179, 8, 0.1)", glow: "0 0 20px rgba(234, 179, 8, 0.2)" };
    case 8:
      return { border: "rgba(249, 115, 22, 0.6)", bg: "rgba(249, 115, 22, 0.1)", glow: "0 0 20px rgba(249, 115, 22, 0.2)" };
    case 10:
      return { border: "rgba(239, 68, 68, 0.6)", bg: "rgba(239, 68, 68, 0.1)", glow: "0 0 20px rgba(239, 68, 68, 0.2)" };
    default:
      return { border: "rgba(255, 255, 255, 0.3)", bg: "rgba(255, 255, 255, 0.05)", glow: "none" };
  }
}

export function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState(question.options);

  useEffect(() => {
    setShuffledOptions(shuffleArray(question.options));
  }, [question.options]);

  const handleSelect = (optionId: string) => {
    if (selectedId) return;

    setSelectedId(optionId);

    setTimeout(() => {
      onAnswer(optionId);
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Question header */}
      <div
        className="text-center space-y-3 p-6 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(212, 175, 55, 0.04) 100%)",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          boxShadow: "0 0 30px rgba(212, 175, 55, 0.08), inset 0 1px 0 rgba(212, 175, 55, 0.1)",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent-gold text-xs uppercase tracking-[0.2em] font-bold"
        >
          {question.context}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-[1.7rem] font-bold text-white leading-snug"
          style={{
            textShadow: "0 0 40px rgba(212, 175, 55, 0.15)",
          }}
        >
          {question.title}
        </motion.h2>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedId === option.id;
          const selectedStyles = isSelected ? getSelectedStyles(option) : null;

          return (
            <motion.div
              key={option.id}
              variants={cardVariants}
              initial="initial"
              animate={isSelected ? "selected" : "animate"}
              exit="exit"
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                variants={pulseVariants}
                initial="initial"
                animate={isSelected ? "pulse" : "initial"}
                className="rounded-xl"
              >
                <div
                  className={`
                    cursor-pointer p-4 rounded-xl transition-all duration-200
                    ${selectedId && selectedId !== option.id ? "opacity-30" : ""}
                  `}
                  style={{
                    background: isSelected
                      ? selectedStyles!.bg
                      : "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
                    border: isSelected
                      ? `1px solid ${selectedStyles!.border}`
                      : "1px solid rgba(255, 255, 255, 0.15)",
                    boxShadow: isSelected ? selectedStyles!.glow : "0 2px 8px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={() => handleSelect(option.id)}
                  onMouseEnter={(e) => {
                    if (!selectedId) {
                      e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.4)";
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(212, 175, 55, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedId) {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                      e.currentTarget.style.background = "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: isSelected
                            ? "rgba(255, 255, 255, 0.15)"
                            : "rgba(212, 175, 55, 0.1)",
                          border: "1px solid rgba(212, 175, 55, 0.2)",
                        }}
                      >
                        <DynamicIcon name={option.icon} />
                      </div>
                    </motion.div>
                    <p className="text-white text-sm md:text-base flex-1 font-semibold leading-relaxed">
                      {option.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
