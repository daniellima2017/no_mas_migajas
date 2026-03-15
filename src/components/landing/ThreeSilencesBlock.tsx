"use client";

import { motion } from "framer-motion";
import { MessageSquareOff, Clock, Ghost } from "lucide-react";

const SILENCES = [
  {
    icon: MessageSquareOff,
    text: "Ignora 3 mensajes seguidos o te deja en \"visto\" sin razon.",
  },
  {
    icon: Clock,
    text: "Responde despues de 24 horas con excusas baratas o frases vacias.",
  },
  {
    icon: Ghost,
    text: "Solo aparece cuando su \"Plan A\" le falla o esta aburrido.",
  },
];

export function ThreeSilencesBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      <h2
        className="font-[var(--font-michroma)] text-lg md:text-xl text-center mb-3"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #9B111E)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ¿Por que te sientes tan agotada?
      </h2>

      <p className="font-[var(--font-inter)] text-zinc-400 text-base md:text-lg text-center mb-8">
        No es solo el desamor. Es el desgaste de vivir en la incertidumbre permanente. Nuestro
        sistema se basa en la{" "}
        <span className="text-[#D4AF37] font-bold">Regla de los 3 Silencios™.</span>
      </p>

      <p className="font-[var(--font-inter)] text-zinc-500 text-sm uppercase tracking-widest text-center mb-4">
        Si el:
      </p>

      <div className="space-y-4 mb-8">
        {SILENCES.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="flex items-start gap-4 rounded-xl p-4"
              style={{
                background: "rgba(155, 17, 30, 0.04)",
                border: "1px solid rgba(155, 17, 30, 0.15)",
              }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(155, 17, 30, 0.12)" }}
              >
                <Icon className="w-5 h-5 text-[#9B111E]" />
              </div>
              <p className="font-[var(--font-inter)] text-zinc-300 text-base leading-relaxed pt-2">
                {item.text}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="font-[var(--font-inter)] text-base text-zinc-400 space-y-4">
        <p>
          Entonces el sistema detecta que eres su{" "}
          <span className="text-[#9B111E] font-bold">Opcion de Reserva</span>. El no tiene miedo a
          perderte porque sabe que tu Adiccion a la Esperanza siempre te hara volver. El esta
          midiendo cuanto desprecio estas dispuesta a tolerar para mantenerlo cerca.
        </p>
        <p className="text-[#9B111E] font-semibold text-center text-lg">
          Y lo peor: cada vez que le escribes primero, le confirmas que puede seguir haciendolo.
        </p>
      </div>
    </motion.section>
  );
}
