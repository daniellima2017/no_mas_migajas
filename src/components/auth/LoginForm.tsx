"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

interface LoginResponse {
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    onboarding_completed: boolean;
    subscription_status: string;
  };
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesion");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Error de conexion. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setForgotError(data.error || "Error al recuperar contrasena");
        return;
      }

      setForgotSuccess(data.message);
    } catch {
      setForgotError("Error de conexion. Intenta nuevamente.");
    } finally {
      setForgotLoading(false);
    }
  }

  if (showForgot) {
    return (
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center">
          <img
            src="/logo.gif"
            alt="No Mas Migajas"
            className="w-96 h-auto"
          />
        </div>

        <div className="text-center">
          <h2 className="text-white text-lg font-semibold">Recuperar contrasena</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Ingresa tu correo y te enviaremos una nueva contrasena
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <Input
              type="email"
              placeholder="Tu correo electronico"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="pl-11 h-12 rounded-xl text-white placeholder:text-zinc-600 focus:ring-accent-gold/30"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
              required
              disabled={forgotLoading}
            />
          </div>

          {forgotError && (
            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: "rgba(185, 28, 28, 0.1)",
                border: "1px solid rgba(185, 28, 28, 0.3)",
              }}
            >
              <p className="text-red-400 text-sm">{forgotError}</p>
            </div>
          )}

          {forgotSuccess && (
            <div
              className="rounded-xl p-3 text-center"
              style={{
                background: "rgba(212, 175, 55, 0.1)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent-gold" />
                <p className="text-accent-gold text-sm">{forgotSuccess}</p>
              </div>
            </div>
          )}

          {!forgotSuccess && (
            <button
              type="submit"
              className="btn-premium w-full h-12 rounded-xl text-base flex items-center justify-center gap-2"
              disabled={forgotLoading}
              style={forgotLoading ? { opacity: 0.7 } : {}}
            >
              {forgotLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar nueva contrasena"
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setShowForgot(false);
              setForgotError("");
              setForgotSuccess("");
              setForgotEmail("");
            }}
            className="w-full flex items-center justify-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio de sesion
          </button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
      <div className="flex flex-col items-center">
        <img
          src="/logo.gif"
          alt="No Mas Migajas"
          className="w-96 h-auto"
        />
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-11 h-12 rounded-xl text-white placeholder:text-zinc-600 focus:ring-accent-gold/30"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <Input
            type="password"
            placeholder="Contrasena"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-11 h-12 rounded-xl text-white placeholder:text-zinc-600 focus:ring-accent-gold/30"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
            required
            disabled={isLoading}
          />
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={() => {
              setShowForgot(true);
              setForgotEmail(email);
            }}
            className="text-zinc-500 text-sm hover:text-accent-gold transition-colors"
          >
            Olvidaste tu contrasena?
          </button>
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl p-3 text-center"
          style={{
            background: "rgba(185, 28, 28, 0.1)",
            border: "1px solid rgba(185, 28, 28, 0.3)",
          }}
        >
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        className="btn-premium w-full h-12 rounded-xl text-base flex items-center justify-center gap-2"
        disabled={isLoading}
        style={isLoading ? { opacity: 0.7 } : {}}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Ingresando...
          </>
        ) : (
          "Ingresar"
        )}
      </button>
    </form>
  );
}
