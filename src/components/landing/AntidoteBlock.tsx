"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Flame, Snowflake, Siren, BookOpen, Medal, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    emoji: "🔬",
    title: "Detector de Interes Real (Indice de Migajas™)",
    description:
      "Un cuestionario de 15 preguntas calibradas cientificamente que escanea tu relacion y te da un diagnostico brutal: Dignidad Estable, Alerta de Desequilibrio, Zona de Migajas o Mendicidad Emocional. Sin filtro. Sin compasion. Solo la verdad en un numero que no puedes ignorar.",
  },
  {
    icon: Flame,
    emoji: "🔥",
    title: "Racha de Dignidad™",
    description:
      "Tu panel interactivo que gamifica tu libertad. Cada hora sin humillarte es una victoria tecnica que reconstruye tu valor. Cada dia sin buscar migajas desbloquea medallas y sube tu nivel. Y si caes, el contador se reinicia a cero — porque la dignidad no acepta excepciones.",
  },
  {
    icon: Snowflake,
    emoji: "🧊",
    title: "Simulador Hielo Seco™ (con Inteligencia Artificial)",
    description: null,
    modes: [
      {
        label: "Modo \"Que te dijo?\"",
        text: "Pega el mensaje que recibiste de el y la IA te traduce lo que REALMENTE quiso decir. Te expone la tactica de manipulacion exacta que esta usando: Control, Validacion, Reconexion o Culpa. Ya no vas a caer en sus palabras bonitas.",
      },
      {
        label: "Modo \"Que quieres mandarle?\"",
        text: "Escribe el mensaje que quieres enviarle ANTES de hacerlo. La IA te muestra exactamente lo que va a pasar si lo envias: como el va a leerlo, que cara va a poner, y como va a usarlo en tu contra. Es como tener a tu mejor amiga mas cruel y mas honesta al lado, las 24 horas.",
      },
    ],
  },
  {
    icon: Siren,
    emoji: "🚨",
    title: "Boton de Panico + Freno Emocional™",
    description:
      "Cuando sientes la urgencia incontrolable de escribirle a las 3 de la manana, presiona el boton rojo. Se activa un freno emocional de 60 segundos que te obliga a respirar antes de hacer algo de lo que te vas a arrepentir. La mayoria de las recaidas duran menos de 90 segundos — este boton te salva en ese momento exacto.",
  },
  {
    icon: BookOpen,
    emoji: "📓",
    title: "Diario de Patrones™",
    description:
      "Un registro privado donde el sistema rastrea tus impulsos, tus recaidas y tus victorias. Con el tiempo, ves con claridad matematica los patrones que te mantienen atrapada — y los que te estan liberando.",
  },
  {
    icon: Medal,
    emoji: "🏅",
    title: "Sistema de Medallas y Niveles",
    description:
      "Cada dia sin mendigar atencion desbloquea logros reales. No es motivacion barata — es evidencia visual de que estas cambiando. Cuando veas 30 dias acumulados, vas a sentir algo que hace mucho no sientes: orgullo de ti misma.",
  },
  {
    icon: BarChart3,
    emoji: "📊",
    title: "Diagnostico Completo Guardado",
    description:
      "Tu resultado del Indice de Migajas queda guardado para siempre. Puedes consultarlo cuando necesites un choque de realidad. Puedes rehacerlo cada 24 horas y VER con numeros como tu dependencia emocional baja semana tras semana.",
  },
];

export function AntidoteBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      {/* Animated mockup */}
      <motion.div
        className="flex justify-center mb-8"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/mockup2.png"
          alt="No Mas Migajas - App de Rescate Emocional"
          width={500}
          height={1000}
          className="w-[75vw] max-w-[380px] md:max-w-[420px] h-auto"
        />
      </motion.div>

      <div className="text-center mb-10">
        <p className="font-[var(--font-inter)] text-zinc-500 text-base mb-4">
          La solucion no es &quot;esperar a que el cambie&quot;. La solucion no es leer otro libro de
          autoayuda. La solucion no es hablar con tus amigas que te dicen &quot;ya dejalo&quot; mientras
          tu sigues pegada al telefono.
        </p>
        <h2
          className="font-[var(--font-michroma)] text-lg md:text-xl mb-2"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #9B111E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          No Mas Migajas™
        </h2>
        <p className="font-[var(--font-inter)] text-zinc-400 text-base">
          Un App de Rescate Emocional que hackea tu autocontrol cuando tu fuerza de voluntad no
          alcanza.
        </p>
      </div>

      <div className="space-y-6">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl p-5"
              style={{
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, rgba(10, 10, 15, 0.95) 100%)",
                border: "1px solid rgba(212, 175, 55, 0.12)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(212, 175, 55, 0.1)" }}
                >
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="font-[var(--font-michroma)] text-xs md:text-sm text-[#D4AF37]">
                  {feature.title}
                </h3>
              </div>

              {feature.description && (
                <p className="font-[var(--font-inter)] text-zinc-400 text-base leading-relaxed">
                  {feature.description}
                </p>
              )}

              {feature.modes && (
                <div className="space-y-3 mt-2">
                  {feature.modes.map((mode, j) => (
                    <div key={j} className="pl-3" style={{ borderLeft: "2px solid rgba(155, 17, 30, 0.4)" }}>
                      <p className="font-[var(--font-inter)] text-base">
                        <span className="text-white font-semibold">→ {mode.label}:</span>{" "}
                        <span className="text-zinc-400">{mode.text}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
