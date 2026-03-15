"use client";

import { motion } from "framer-motion";
import { Eye, Shield, Crosshair, Gift } from "lucide-react";

const BONUSES = [
  {
    icon: Eye,
    title: "Archivo de Realidad Cruel™",
    value: "$12",
    description:
      "Tu diagnostico completo con nivel, veredicto y puntuacion bruta guardado para siempre dentro del sistema. Consultalo cada vez que tu mente intente idealizar a quien te destruyo. Los numeros no mienten y no te tienen lastima. Es el espejo que te impide volver a mentirte.",
  },
  {
    icon: Shield,
    title: "Escudo de Emergencia™",
    value: "$9",
    description:
      "El Boton de Panico con Freno Emocional de 60 segundos. Cuando estes a punto de escribirle, este escudo se activa y te da el tiempo justo para que tu cerebro racional tome el control antes de que tu adiccion emocional te haga arrastrarte otra vez.",
  },
  {
    icon: Crosshair,
    title: "Guia de Combate Hielo Seco™",
    value: "$7",
    description:
      "Tutorial interactivo paso a paso que te ensena a usar el Simulador como un arma. Aprende a decodificar cada mensaje que recibes y a frenar cada impulso de escribirle. Despues de esta guia, nunca mas vas a leer un \"hola, como estas?\" de la misma forma.",
  },
];

export function BonusBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      <h2
        className="font-[var(--font-michroma)] text-lg md:text-xl text-center mb-2"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #9B111E)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Bonos Incluidos
      </h2>
      <p className="font-[var(--font-inter)] text-zinc-500 text-sm text-center mb-8">
        Todo esto esta incluido sin costo adicional cuando activas tu acceso hoy:
      </p>

      <div className="space-y-4">
        {BONUSES.map((bonus, i) => {
          const Icon = bonus.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="rounded-xl p-5"
              style={{
                background: "linear-gradient(135deg, rgba(212, 175, 55, 0.04) 0%, rgba(10, 10, 15, 0.95) 100%)",
                border: "1px solid rgba(212, 175, 55, 0.15)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-[var(--font-inter)] text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                    Bono {i + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-zinc-600 line-through text-xs font-[var(--font-mono)]">
                    {bonus.value}
                  </span>
                  <span className="text-[#22c55e] text-xs font-bold font-[var(--font-mono)]">
                    GRATIS
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(212, 175, 55, 0.1)" }}
                >
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="font-[var(--font-michroma)] text-xs text-white mb-2">
                    {bonus.title}
                  </h3>
                  <p className="font-[var(--font-inter)] text-zinc-500 text-xs leading-relaxed">
                    {bonus.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        className="mt-6 rounded-xl p-4 text-center"
        style={{
          background: "rgba(212, 175, 55, 0.05)",
          border: "1px solid rgba(212, 175, 55, 0.2)",
        }}
      >
        <p className="font-[var(--font-mono)] text-sm">
          <span className="text-zinc-500 line-through">Valor total: $75 USD</span>
          <span className="mx-3 text-zinc-600">→</span>
          <span
            className="font-bold text-lg"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #c9a227)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Hoy pagas: $17 USD
          </span>
        </p>
      </div>
    </motion.section>
  );
}
