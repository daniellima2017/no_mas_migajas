"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Radar, Scan } from "lucide-react";

function generateParticlePositions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: i * 0.2 + Math.random() * 0.3,
    top: 20 + Math.random() * 60,
    left: 20 + Math.random() * 60,
  }));
}

export function GlitchEffect() {
  const particles = useMemo(() => generateParticlePositions(4), []);

  return (
    <Card className="bg-bg-card border-border-default overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.4,
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-accent-red/30"
          />
        ))}
      </div>

      <div className="p-8 flex flex-col items-center justify-center space-y-6 relative z-10">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, rgba(220, 38, 38, 0.3) 25%, transparent 50%)",
            }}
          />

          <div className="w-20 h-20 rounded-full border-2 border-accent-red/40 flex items-center justify-center relative bg-zinc-900/50">
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-1 rounded-full border border-accent-red/20"
            />

            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-3 rounded-full border border-accent-red/15"
            />

            <Radar className="w-8 h-8 text-accent-red relative z-10" />
          </div>

          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: particle.delay,
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-accent-red"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
              }}
            />
          ))}
        </div>

        <div className="space-y-3 text-center w-full max-w-xs">
          <div className="relative overflow-hidden rounded-lg bg-zinc-900/50 border border-accent-red/20 px-4 py-2">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-accent-red/50 to-transparent"
            />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-accent-red font-mono text-xs uppercase tracking-widest"
            >
              Analizando mensaje
            </motion.p>
          </div>

          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center justify-center gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
                className="w-1.5 h-1.5 rounded-full bg-accent-red"
              />
            ))}
          </motion.div>

          <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 font-mono">
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.5 }}
            >
              <Scan className="w-3 h-3" />
            </motion.div>
            <span>Desvelando intencion real...</span>
          </div>
        </div>
      </div>
    </Card>
  );
}