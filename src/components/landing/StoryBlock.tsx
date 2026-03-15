"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function StoryBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="px-5 py-12 max-w-xl mx-auto"
    >
      {/* Laura avatar */}
      <div className="flex justify-center mb-6">
        <div
          className="w-20 h-20 rounded-full overflow-hidden"
          style={{
            border: "2px solid rgba(212, 175, 55, 0.3)",
            boxShadow: "0 0 20px rgba(212, 175, 55, 0.1)",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face"
            alt="Laura"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="font-[var(--font-inter)] text-zinc-400 text-base md:text-lg leading-relaxed space-y-5">
        <p>
          Hace tres meses, <span className="text-white font-semibold">Laura (32 anos)</span> revisaba
          su WhatsApp <span className="text-[#9B111E] font-semibold">47 veces al dia</span>. Contaba
          los minutos entre cada respuesta de el. Si tardaba mas de una hora, le sudaban las manos. Si
          la dejaba en visto, le temblaba el pecho.
        </p>

        <p>
          El desaparecia por dias. Ignoraba sus llamadas. Y cuando volvia, Laura siempre tenia una
          excusa lista:{" "}
          <span className="text-zinc-300 italic">
            &quot;esta estresado&quot;, &quot;tuvo un dia dificil&quot;, &quot;en el fondo me quiere&quot;
          </span>
          .
        </p>

        <p>
          Un martes a las 2 de la manana, con el telefono en la mano y las lagrimas en la cara, Laura
          activo el Detector de Interes Real de{" "}
          <span className="text-[#D4AF37] font-semibold">No Mas Migajas™</span>. El resultado fue un
          golpe en el estomago:{" "}
          <span
            className="font-bold"
            style={{ color: "#ef4444" }}
          >
            Mendicidad Emocional — tu autoestima esta en crisis.
          </span>
        </p>

        <p>
          El sistema le mostro que el &quot;estres&quot; de el solo existia cuando ella le pedia afecto.
          Que sus mensajes &quot;bonitos&quot; solo aparecian cuando el necesitaba algo. Que Laura no era
          su novia, era su <span className="text-[#9B111E] font-bold">Plan B</span>.
        </p>

        <div
          className="rounded-xl p-5 mt-4"
          style={{
            background: "linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(10, 10, 10, 0.95) 100%)",
            border: "1px solid rgba(212, 175, 55, 0.15)",
          }}
        >
          <p className="text-zinc-300">
            Ese dia, Laura dejo de rogar. Hoy, su{" "}
            <span className="text-[#D4AF37] font-semibold">Racha de Dignidad marca 120 dias</span>.
            Duerme sin revisar el telefono. Y por primera vez en anos, su valor no depende del mensaje de
            un manipulador.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
