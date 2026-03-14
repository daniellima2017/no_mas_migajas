"use client";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-zinc-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Sin Conexion</h1>
          <p className="text-zinc-400 text-sm">
            No tienes acceso a internet en este momento.
          </p>
        </div>

        <div className="bg-bg-card border border-border-default rounded-lg p-4 text-left space-y-3">
          <p className="text-zinc-300 text-sm font-semibold">
            Funciones disponibles offline:
          </p>
          <ul className="text-zinc-500 text-sm space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
              Ver tu streak actual
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
              Consultar tus medallas
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
              Revisar tu historial
            </li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}