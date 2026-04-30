import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check onboarding status
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.onboarding_completed_at) {
    redirect("/app/onboarding");
  }

  return (
    <div className="min-h-screen">
      {/* App header */}
      <header className="border-b border-border bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="font-[family-name:var(--font-sora)] text-bg-primary font-bold text-sm">
                F
              </span>
            </div>
            <span className="font-[family-name:var(--font-sora)] text-xl font-bold tracking-tight text-text-primary">
              FAMA
            </span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted hidden sm:block">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>

          <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Tu espacio financiero
          </h1>
          <p className="text-text-secondary text-lg mb-10 leading-relaxed">
            Estamos preparando tu experiencia personalizada. Pronto vas a poder conectar tu
            situación financiera, simular escenarios y tomar decisiones con claridad.
          </p>

          <div className="card-gradient-border p-8 sm:p-10 text-left">
            <h2 className="font-[family-name:var(--font-sora)] text-lg font-semibold text-text-primary mb-4">
              Próximos pasos
            </h2>
            <ul className="space-y-4">
              {[
                "Onboarding conversacional para entender tu situación",
                "Radiografía financiera personalizada",
                "Proyección a 12 meses de tus finanzas",
                "Simulador de escenarios reales",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full border border-border flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-text-muted" />
                  </span>
                  <span className="text-sm text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
