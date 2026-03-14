"use client";

import { motion } from "framer-motion";
import { Shield, Award, Crown, Diamond, Star, Lock } from "lucide-react";
import type { Medal } from "@/types";

interface MedalGridProps {
  medals: Medal[];
}

interface MedalConfig {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const MEDAL_CONFIGS: MedalConfig[] = [
  {
    type: "bronze_12h",
    label: "12 Horas",
    icon: Shield,
    description: "Primeras 12 horas completadas",
  },
  {
    type: "silver_24h",
    label: "24 Horas",
    icon: Award,
    description: "Un dia sin migajas",
  },
  {
    type: "gold_3d",
    label: "3 Dias",
    icon: Crown,
    description: "Tres dias de hielo",
  },
  {
    type: "diamond_7d",
    label: "7 Dias",
    icon: Diamond,
    description: "Una semana blindada",
  },
  {
    type: "dignity_21d",
    label: "21 Dias",
    icon: Star,
    description: "Dignidad restaurada",
  },
];

export function MedalGrid({ medals }: MedalGridProps) {
  const unlockedTypes = new Set(medals.map((m) => m.medal_type));

  return (
    <div className="w-full">
      <h3 className="text-zinc-400 text-sm uppercase tracking-wider mb-4">
        Medallas
      </h3>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-4">
        {MEDAL_CONFIGS.map((config, index) => {
          const isUnlocked = unlockedTypes.has(config.type);
          const IconComponent = config.icon;

          return (
            <motion.div
              key={config.type}
              initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: index * 0.1,
              }}
              className="flex flex-col items-center"
            >
              <motion.div
                whileHover={isUnlocked ? { scale: 1.1, rotateY: 15 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                className={`
                  relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full
                  flex items-center justify-center
                  transition-all duration-300 overflow-hidden
                  ${
                    isUnlocked
                      ? "bg-zinc-800"
                      : "bg-zinc-800 border border-zinc-700"
                  }
                `}
              >
                {isUnlocked && (
                  <>
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(212, 175, 55, 0.3), 0 0 20px rgba(212, 175, 55, 0.2)",
                          "0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)",
                          "0 0 10px rgba(212, 175, 55, 0.3), 0 0 20px rgba(212, 175, 55, 0.2)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #92400e 0%, #d97706 25%, #fbbf24 50%, #d97706 75%, #92400e 100%)",
                        backgroundSize: "200% 200%",
                      }}
                    />

                    <motion.div
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, #92400e 0%, #d97706 25%, #fbbf24 50%, #d97706 75%, #92400e 100%)",
                        backgroundSize: "200% 200%",
                      }}
                    />

                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                      }}
                    />

                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.1) 10%, transparent 20%)",
                      }}
                    />
                  </>
                )}

                <div className="relative z-10">
                  {isUnlocked ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white drop-shadow-lg" />
                    </motion.div>
                  ) : (
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6 text-zinc-600" />
                  )}
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`
                  mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-center
                  ${isUnlocked ? "text-accent-gold font-semibold" : "text-zinc-600"}
                `}
              >
                {config.label}
              </motion.p>

              <p className="text-xs text-zinc-500 text-center hidden md:block mt-1">
                {config.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>{medals.length} de 5 desbloqueadas</span>
        {medals.length === 5 && (
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-accent-gold font-semibold"
          >
            Coleccion completa
          </motion.span>
        )}
      </div>
    </div>
  );
}