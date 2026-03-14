"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Sun, Clock, Zap } from "lucide-react";

interface ReinforcementFeedProps {
  streakSeconds: number;
}

type DangerLevel = "critical" | "warning" | "stable" | "strong";
type TimeOfDay = "dawn" | "morning" | "afternoon" | "evening" | "night";

const REINFORCEMENT_MESSAGES: Record<DangerLevel, Record<TimeOfDay, string[]>> = {
  critical: {
    dawn: ["La madrugada miente. Apaga el telefono.", "El te busca cuando estas debil. No cedas.", "Las 3AM son el momento de la verdad. Elige bien.", "Tu debilidad es su estrategia. Mantente fuerte."],
    morning: ["Recien despierta y ya piensas en el. Detente.", "La manana es para ti, no para recordar.", "Tu primera decision del dia define las demas.", "El sol sale, pero tu mente sigue en el. Cambia eso."],
    afternoon: ["Mediodia y la ansiedad aumenta. Resistela.", "El aburrimiento es el enemigo. Haz algo.", "Esta hora es peligrosa. Mantente ocupada.", "Tu mente busca excusas. No se las des."],
    evening: ["El atardecer trae recuerdos. No los sigas.", "La noche es larga. Preparate mentalmente.", "Cada hora que pasa es una batalla. Ganala.", "El silencio de la tarde es enganoso. Estate alerta."],
    night: ["La noche es el momento mas peligroso. Mantente fuerte.", "Su mensaje llegara cuando bajes la guardia. No lo leas.", "La soledad nocturna miente. No estas sola.", "Cerrar los ojos no borra los pensamientos. Actua."],
  },
  warning: {
    dawn: ["Aun es temprano. El dia es tuyo.", "La madrugada prueba tu determinacion.", "Resististe la noche. Sigue asi."],
    morning: ["Vas bien, pero no bajes la guardia.", "Cada manana sin el es una victoria.", "Tu progreso es real, pero fragil."],
    afternoon: ["Mitad del dia. Sigue en pie.", "La tarde puede traer tentaciones. Evitalas.", "Tu fuerza esta en tu rutina."],
    evening: ["El dia termina. Cierralo con dignidad.", "No dejes que la noche te gane.", "Una jornada mas sin ceder."],
    night: ["La noche es un reto, pero puedes superarlo.", "Dormir sin escribirle es sanar.", "Manana sera otro dia de victoria."],
  },
  stable: {
    dawn: ["Nueva madrugada, nueva oportunidad.", "El ciclo se rompe con cada amanecer.", "Tu determinacion es tu escudo."],
    morning: ["Buen inicio de dia. Mantenlo asi.", "La consistencia construye fortaleza.", "Ya no eres aquella que cedia."],
    afternoon: ["Vas por buen camino. No te desvies.", "Cada hora suma a tu recuperacion.", "Tu mente esta mas clara cada dia."],
    evening: ["Otro dia completado. Sigue sumando.", "Tu rutina es tu armadura.", "La fortaleza se construye dia a dia."],
    night: ["Cada noche superada te hace mas fuerte.", "Descansa. Te lo mereces.", "Manana continuara tu camino."],
  },
  strong: {
    dawn: ["Ya ni la madrugada te afecta.", "Tu fuerza es innegable.", "El tiempo juega a tu favor."],
    morning: ["Despiertas sin pensar en el. Eso es poder.", "Tu independencia es real.", "Ya no eres la misma de antes."],
    afternoon: ["Los dias pasan y tu sigues en pie.", "Tu autoestima se reconstruye.", "La libertad tiene un sabor nuevo."],
    evening: ["Un dia mas de dignidad.", "Tu ejemplo inspira a otras.", "Ya no hay marcha atras."],
    night: ["La noche ya no te asusta.", "Tu paz mental es tu mayor logro.", "Sueno tranquila. Ganaste el dia."],
  },
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 6) return "dawn";
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

function getDangerLevel(streakSeconds: number): DangerLevel {
  const hours = streakSeconds / 3600;
  if (hours < 24) return "critical";
  if (hours < 72) return "warning";
  if (hours < 168) return "stable";
  return "strong";
}

const levelStyles: Record<DangerLevel, { text: string; border: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  critical: { text: "text-red-400", border: "rgba(248, 113, 113, 0.2)", bg: "rgba(248, 113, 113, 0.06)", icon: AlertTriangle },
  warning: { text: "text-orange-400", border: "rgba(251, 146, 60, 0.2)", bg: "rgba(251, 146, 60, 0.06)", icon: Zap },
  stable: { text: "text-yellow-400", border: "rgba(250, 204, 21, 0.2)", bg: "rgba(250, 204, 21, 0.06)", icon: Clock },
  strong: { text: "text-emerald-400", border: "rgba(52, 211, 153, 0.2)", bg: "rgba(52, 211, 153, 0.06)", icon: Sun },
};

export function ReinforcementFeed({ streakSeconds }: ReinforcementFeedProps) {
  const timeOfDay = useMemo(() => getTimeOfDay(), []);
  const dangerLevel = useMemo(() => getDangerLevel(streakSeconds), [streakSeconds]);
  const style = levelStyles[dangerLevel];
  const messages = useMemo(() => REINFORCEMENT_MESSAGES[dangerLevel][timeOfDay], [dangerLevel, timeOfDay]);

  const [messageIndex, setMessageIndex] = useState(() =>
    Math.floor(Math.random() * messages.length)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const IconComponent = style.icon;

  return (
    <div
      className="glass-card p-4"
      style={{
        borderColor: style.border,
        background: `linear-gradient(135deg, ${style.bg} 0%, rgba(255,255,255,0.01) 100%)`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
          style={{ background: style.bg }}
        >
          <IconComponent className={`w-4 h-4 ${style.text}`} />
        </div>

        <div className="flex-1 min-h-[2.5rem] flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={`${dangerLevel}-${timeOfDay}-${messageIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-zinc-200 text-sm leading-relaxed font-medium"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
