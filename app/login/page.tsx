"use client";

import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      if (authError.message === "Invalid login credentials") {
        setError("Email o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Intentá de nuevo.");
      }
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="font-[family-name:var(--font-sora)] text-bg-primary font-bold text-sm">
              F
            </span>
          </div>
          <span className="font-[family-name:var(--font-sora)] text-xl font-bold tracking-tight text-text-primary">
            FAMA
          </span>
        </Link>

        <div className="card-gradient-border p-8">
          <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold text-text-primary mb-2 text-center">
            Iniciá sesión
          </h1>
          <p className="text-text-secondary text-sm text-center mb-8">
            Accedé a tu espacio financiero
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent text-bg-primary font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-text-muted text-sm text-center mt-6">
            ¿No tenés cuenta?{" "}
            <Link href="/registro" className="text-accent hover:text-accent-hover transition-colors">
              Creá una gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
