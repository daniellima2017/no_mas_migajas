"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const NAMES = [
  "Maria G.", "Valentina R.", "Camila S.", "Sofia L.", "Isabella M.",
  "Daniela P.", "Mariana T.", "Andrea V.", "Lucia F.", "Gabriela H.",
  "Paula C.", "Natalia B.", "Carolina D.", "Ana K.", "Elena J.",
  "Victoria A.", "Fernanda O.", "Laura N.", "Diana E.", "Alejandra Q.",
  "Jimena R.", "Paola S.", "Karla M.", "Monica T.", "Rosa L.",
];

const CITIES = [
  "Ciudad de Mexico", "Bogota", "Lima", "Buenos Aires", "Santiago",
  "Madrid", "Barcelona", "Guadalajara", "Medellin", "Quito",
  "Monterrey", "Caracas", "San Jose", "Panama", "Santo Domingo",
];

const TIME_AGO = [
  "hace 2 min", "hace 5 min", "hace 8 min", "hace 12 min",
  "hace 15 min", "hace 23 min", "hace 31 min", "hace 45 min",
];

export function SocialProofToast({
  onPurchase,
}: {
  onPurchase: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({ name: "", city: "", time: "" });

  const showToast = useCallback(() => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const time = TIME_AGO[Math.floor(Math.random() * TIME_AGO.length)];
    setCurrent({ name, city, time });
    setVisible(true);
    onPurchase();

    setTimeout(() => setVisible(false), 4000);
  }, [onPurchase]);

  useEffect(() => {
    // First toast after 8-15 seconds
    const firstDelay = Math.random() * 7000 + 8000;
    const firstTimeout = setTimeout(() => {
      showToast();
      // Then repeat every 25-45 seconds
      const interval = setInterval(() => {
        showToast();
      }, Math.random() * 20000 + 25000);
      return () => clearInterval(interval);
    }, firstDelay);

    return () => clearTimeout(firstTimeout);
  }, [showToast]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-4 z-50 max-w-[320px]"
        >
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(20, 20, 25, 0.98), rgba(10, 10, 15, 0.98))",
              border: "1px solid rgba(212, 175, 55, 0.25)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)" }}
            >
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold font-[var(--font-inter)] leading-tight">
                {current.name}{" "}
                <span className="text-zinc-400 font-normal text-xs">activo su acceso</span>
              </p>
              <p className="text-zinc-600 text-[11px] font-[var(--font-inter)]">
                {current.city} · {current.time}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
