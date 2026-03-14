"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Check, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PasswordResetProps {
  onSuccess?: () => void;
}

export function PasswordReset({ onSuccess }: PasswordResetProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      onSuccess?.();
    } catch {
      setError("Error al actualizar la contrasena");
    } finally {
      setIsLoading(false);
    }
  }, [newPassword, confirmPassword, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-zinc-300 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Nueva contrasena
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimo 6 caracteres"
            className="w-full bg-bg-primary border border-border-default rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-accent-gold/50 transition-colors"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-300">Confirmar contrasena</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repite la contrasena"
          className="w-full bg-bg-primary border border-border-default rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-accent-gold/50 transition-colors"
          disabled={isLoading}
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-accent-red text-sm bg-bg-danger/20 border border-border-danger rounded-lg p-3"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-500 text-sm bg-green-500/10 border border-green-500/30 rounded-lg p-3"
        >
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>Contrasena actualizada correctamente</span>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword}
        className="w-full py-3 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Actualizando..." : "Cambiar contrasena"}
      </button>
    </form>
  );
}