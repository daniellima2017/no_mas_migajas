"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function HeroBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-8 text-center max-w-2xl mx-auto"
    >
      <h1
        className="font-[var(--font-michroma)] text-2xl md:text-4xl leading-tight font-bold mb-8"
        style={{
          background: "linear-gradient(135deg, #D4AF37 0%, #c9a227 50%, #9B111E 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        El test de 60 segundos que destruye la mentira que te repites cada noche antes de dormir.
      </h1>

      {/* App Mockup Image */}
      <div className="flex justify-center mb-6">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 0 60px rgba(212, 175, 55, 0.1), 0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <Image
            src="/mockup2.png"
            alt="No Mas Migajas - App con Inteligencia Artificial"
            width={400}
            height={800}
            className="w-[340px] md:w-[400px] h-auto"
            priority
          />
        </div>
      </div>

      <p className="text-xs uppercase tracking-widest text-zinc-600 font-[var(--font-mono)] mb-6">
        Mini-App con Inteligencia Artificial
      </p>

      <p className="font-[var(--font-inter)] text-zinc-400 text-lg md:text-xl leading-relaxed mb-8">
        Mas de 12,400 mujeres ya descubrieron su{" "}
        <span className="text-[#D4AF37] font-semibold">Indice de Migajas™</span> y
        dejaron de mendigar atencion de un hombre que las tiene como Plan B. Hoy
        es tu turno de ver la verdad que nadie se atreve a decirte.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4"
                fill={i < 5 ? "#D4AF37" : "transparent"}
                stroke={i < 5 ? "#D4AF37" : "#555"}
              />
            ))}
          </div>
          <span className="text-zinc-400">
            Calificacion promedio: <span className="text-white font-semibold">4.8/5</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-zinc-400">
            Usuarias conectadas ahora: <span className="text-white font-semibold">37</span>
          </span>
        </div>
      </div>
    </motion.section>
  );
}
