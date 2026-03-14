import { XCircle, Mail } from "lucide-react";

export default function AccessExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-accent-red" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Acceso Expirado</h1>
          <p className="text-zinc-400">
            Tu suscripcion no esta activa.
          </p>
        </div>

        <div className="bg-bg-card border border-border-default rounded-lg p-6 space-y-4">
          <p className="text-zinc-300 text-sm leading-relaxed">
            Tu acceso a No Mas Migajas ha sido revocado. Esto puede deberse a:
          </p>
          
          <ul className="text-zinc-400 text-sm text-left space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">*</span>
              <span>Tu pago no fue procesado correctamente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">*</span>
              <span>Tu suscripcion fue cancelada</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-red mt-1">*</span>
              <span>El periodo de prueba ha finalizado</span>
            </li>
          </ul>
        </div>

        <p className="text-zinc-500 text-sm">
          Si crees que esto es un error, contacta a soporte.
        </p>

        <a
          href="mailto:soporte@nomasmigajas.com"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-btn-primary px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
        >
          <Mail className="h-4 w-4" />
          Contactar Soporte
        </a>
      </div>
    </div>
  );
}