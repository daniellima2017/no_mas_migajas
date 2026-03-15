"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "¿Es No Mas Migajas™ un curso o un libro?",
    a: "No. Es un mini-app interactivo con inteligencia artificial. No tienes que estudiar nada. Solo abres el sistema cuando sientes ansiedad, cuando el te escribio algo raro, o cuando estas a punto de cometer el error de escribirle. El app trabaja por ti.",
  },
  {
    q: "¿Realmente funciona si llevo anos en esta relacion?",
    a: "Si. De hecho, cuanto mas tiempo llevas, mas viciada estas a la esperanza. El sistema actua como un desintoxicante emocional acelerado. Las mujeres que mas tiempo llevan atrapadas son las que mas impacto sienten al ver su Indice de Migajas por primera vez.",
  },
  {
    q: "¿Que pasa si vuelvo a caer y le escribo?",
    a: "Tu Racha de Dignidad se reinicia a cero. El app no te juzga — te muestra el patron para que vuelvas a empezar con mas fuerza. Cada recaida registrada es informacion que el sistema usa para ayudarte a no repetirla.",
  },
  {
    q: "¿Tengo que pagar una suscripcion mensual?",
    a: "No. Es un pago unico de $17. Acceso completo al sistema, todas las herramientas y todos los bonos. Para siempre.",
  },
  {
    q: "¿Como recibo el acceso?",
    a: "Inmediatamente despues del pago, recibes un link privado en tu email para acceder al sistema desde cualquier dispositivo: Android, iOS o computadora. En menos de 2 minutos ya estaras viendo tu diagnostico.",
  },
];

export function FAQBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      <h2
        className="font-[var(--font-michroma)] text-lg md:text-xl text-center mb-8"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #9B111E)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Preguntas Frecuentes
      </h2>

      <div className="space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: `1px solid ${isOpen ? "rgba(212, 175, 55, 0.25)" : "rgba(255, 255, 255, 0.06)"}`,
                transition: "border-color 0.3s",
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-[var(--font-inter)] text-sm text-zinc-300 pr-4 font-medium">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p className="font-[var(--font-inter)] text-zinc-500 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
