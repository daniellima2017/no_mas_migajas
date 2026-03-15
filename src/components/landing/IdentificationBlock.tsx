"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ITEMS = [
  "Revisas si el estuvo \"en linea\" aunque no te escriba.",
  "Lees el mismo mensaje suyo 10 veces intentando entenderlo.",
  "Prometes no escribirle… y terminas escribiendo igual.",
  "Cuando el desaparece, sientes ansiedad en el pecho.",
  "Buscas excusas para justificar lo que el te hace.",
  "Sabes que te hace dano, pero no puedes soltar.",
];

export function IdentificationBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(155, 17, 30, 0.06) 0%, rgba(10, 10, 10, 0.95) 100%)",
          border: "1px solid rgba(155, 17, 30, 0.25)",
          boxShadow: "0 0 40px rgba(155, 17, 30, 0.08)",
        }}
      >
        <h2
          className="font-[var(--font-michroma)] text-lg md:text-xl text-center mb-6"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #9B111E)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Si alguna de estas cosas te pasa, este test es para ti:
        </h2>

        <div className="space-y-4">
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                style={{
                  background: "rgba(155, 17, 30, 0.2)",
                  border: "1px solid rgba(155, 17, 30, 0.4)",
                }}
              >
                <Check className="w-3 h-3 text-[#9B111E]" />
              </div>
              <p className="font-[var(--font-inter)] text-zinc-300 text-sm leading-relaxed">
                {item}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="font-[var(--font-inter)] text-center mt-8 text-sm">
          <span className="text-zinc-400">Si reconociste 2 o mas…</span>{" "}
          <span className="text-[#9B111E] font-bold">
            necesitas ver tu Indice de Migajas. Ahora.
          </span>
        </p>
      </div>
    </motion.section>
  );
}
