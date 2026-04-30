"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Debt {
  id: string;
  name: string;
  balance: string;
  monthly_payment: string;
  interest_rate: string;
}

const TOTAL_STEPS = 4;

function formatCOP(value: string): string {
  const num = value.replace(/\D/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("es-CO");
}

function parseCOP(value: string): number {
  return Number(value.replace(/\./g, "").replace(/,/g, "")) || 0;
}

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Step 1: Income & expenses
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");

  // Step 2: Savings
  const [currentSavings, setCurrentSavings] = useState("");

  // Step 3: Debts
  const [hasDebts, setHasDebts] = useState<boolean | null>(null);
  const [debts, setDebts] = useState<Debt[]>([
    { id: crypto.randomUUID(), name: "", balance: "", monthly_payment: "", interest_rate: "" },
  ]);

  // Step 4: Goal
  const [financialGoal, setFinancialGoal] = useState("");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing profile data
  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        if (profile.onboarding_completed_at) {
          router.push("/app");
          return;
        }
        if (profile.onboarding_step && profile.onboarding_step > 0) {
          setStep(profile.onboarding_step);
        }
        if (profile.monthly_income) setMonthlyIncome(formatCOP(String(profile.monthly_income)));
        if (profile.monthly_fixed_expenses) setMonthlyExpenses(formatCOP(String(profile.monthly_fixed_expenses)));
        if (profile.current_savings) setCurrentSavings(formatCOP(String(profile.current_savings)));
        if (profile.has_debts !== null) setHasDebts(profile.has_debts);
        if (profile.financial_goal) setFinancialGoal(profile.financial_goal);

        // Load debts
        if (profile.has_debts) {
          const { data: existingDebts } = await supabase
            .from("debts")
            .select("*")
            .eq("user_id", user.id);
          if (existingDebts && existingDebts.length > 0) {
            setDebts(
              existingDebts.map((d) => ({
                id: d.id,
                name: d.name || "",
                balance: d.balance ? formatCOP(String(d.balance)) : "",
                monthly_payment: d.monthly_payment ? formatCOP(String(d.monthly_payment)) : "",
                interest_rate: d.interest_rate ? String(d.interest_rate) : "",
              }))
            );
          }
        }
      } else {
        // Create profile if it doesn't exist (for users who signed up before the trigger)
        await supabase.from("profiles").upsert({ id: user.id });
      }
      setLoading(false);
    }
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProgress = useCallback(
    async (currentStep: number, extra?: Record<string, unknown>) => {
      if (!userId) return;
      const supabase = createClient();
      const updateData: Record<string, unknown> = {
        onboarding_step: currentStep,
        updated_at: new Date().toISOString(),
        ...extra,
      };
      await supabase.from("profiles").update(updateData).eq("id", userId);
    },
    [userId]
  );

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};

    if (s === 1) {
      if (!monthlyIncome.trim()) errs.monthlyIncome = "Ingresa tu ingreso mensual";
      if (!monthlyExpenses.trim()) errs.monthlyExpenses = "Ingresa tus gastos fijos";
    } else if (s === 2) {
      if (!currentSavings.trim()) errs.currentSavings = "Ingresa tu ahorro o liquidez disponible";
    } else if (s === 3) {
      if (hasDebts === null) errs.hasDebts = "Selecciona si tienes deudas";
      if (hasDebts) {
        debts.forEach((d, i) => {
          if (!d.balance.trim()) errs[`debt_balance_${i}`] = "Ingresa el saldo";
          if (!d.monthly_payment.trim()) errs[`debt_payment_${i}`] = "Ingresa la cuota mensual";
        });
      }
    } else if (s === 4) {
      if (!financialGoal.trim()) errs.financialGoal = "Selecciona tu objetivo principal";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleNext() {
    if (!validateStep(step)) return;
    setSaving(true);

    if (step === 1) {
      await saveProgress(2, {
        monthly_income: parseCOP(monthlyIncome),
        monthly_fixed_expenses: parseCOP(monthlyExpenses),
      });
      setStep(2);
    } else if (step === 2) {
      await saveProgress(3, {
        current_savings: parseCOP(currentSavings),
      });
      setStep(3);
    } else if (step === 3) {
      await saveProgress(4, {
        has_debts: hasDebts,
        total_monthly_debt_payment: hasDebts
          ? debts.reduce((sum, d) => sum + parseCOP(d.monthly_payment), 0)
          : 0,
      });

      // Save debts
      if (userId) {
        const supabase = createClient();
        // Delete existing debts first, then insert fresh
        await supabase.from("debts").delete().eq("user_id", userId);
        if (hasDebts) {
          const debtRows = debts.map((d) => ({
            user_id: userId,
            name: d.name || null,
            balance: parseCOP(d.balance),
            monthly_payment: parseCOP(d.monthly_payment),
            interest_rate: d.interest_rate ? Number(d.interest_rate) : null,
          }));
          await supabase.from("debts").insert(debtRows);
        }
      }

      setStep(4);
    } else if (step === 4) {
      await saveProgress(4, {
        financial_goal: financialGoal,
        onboarding_completed_at: new Date().toISOString(),
      });
      setStep(5); // Summary screen
    }

    setSaving(false);
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
    setErrors({});
  }

  function addDebt() {
    setDebts([
      ...debts,
      { id: crypto.randomUUID(), name: "", balance: "", monthly_payment: "", interest_rate: "" },
    ]);
  }

  function removeDebt(index: number) {
    if (debts.length > 1) {
      setDebts(debts.filter((_, i) => i !== index));
    }
  }

  function updateDebt(index: number, field: keyof Debt, value: string) {
    const updated = [...debts];
    if (field === "balance" || field === "monthly_payment") {
      updated[index][field] = formatCOP(value);
    } else {
      updated[index][field] = value;
    }
    setDebts(updated);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Step 5: Summary / Completion
  if (step === 5) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Tu radiografía financiera inicial está lista
          </h1>
          <p className="text-text-secondary text-lg mb-4 leading-relaxed">
            Ya tenemos lo que necesitamos para empezar a trabajar contigo.
          </p>

          <div className="card-gradient-border p-6 sm:p-8 text-left mb-8">
            <h2 className="font-[family-name:var(--font-sora)] text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">
              Resumen
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Ingreso mensual</span>
                <span className="text-text-primary font-medium">$ {monthlyIncome}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Gastos fijos</span>
                <span className="text-text-primary font-medium">$ {monthlyExpenses}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Ahorro disponible</span>
                <span className="text-text-primary font-medium">$ {currentSavings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Deudas activas</span>
                <span className="text-text-primary font-medium">{hasDebts ? `${debts.length}` : "Ninguna"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Objetivo</span>
                <span className="text-text-primary font-medium">{financialGoal}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/app")}
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-accent text-bg-primary font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Continuar a mi espacio
          </button>
        </div>
      </div>
    );
  }

  const goals = [
    "Ahorrar para una meta específica",
    "Pagar mis deudas más rápido",
    "Entender mejor mis finanzas",
    "Tomar una decisión financiera importante",
    "Mejorar mi flujo de caja mensual",
    "Otro",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="font-[family-name:var(--font-sora)] text-bg-primary font-bold text-sm">F</span>
            </div>
            <span className="font-[family-name:var(--font-sora)] text-xl font-bold tracking-tight text-text-primary">
              FAMA
            </span>
          </Link>
          <span className="text-sm text-text-muted">
            Paso {step} de {TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-bg-secondary">
        <div
          className="h-1 bg-accent transition-all duration-500 ease-out"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-start sm:items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-lg">
          {/* Step 1: Income & Expenses */}
          {step === 1 && (
            <div>
              <h1 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                Tu ingreso y gastos
              </h1>
              <p className="text-text-secondary mb-8">
                Empecemos con lo básico: ¿cuánto entra y cuánto sale cada mes?
              </p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="income" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Ingreso mensual neto (COP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                    <input
                      id="income"
                      type="text"
                      inputMode="numeric"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(formatCOP(e.target.value))}
                      placeholder="3.500.000"
                      className="w-full pl-8 pr-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  {errors.monthlyIncome && (
                    <p className="text-red-400 text-xs mt-1">{errors.monthlyIncome}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="expenses" className="block text-sm font-medium text-text-secondary mb-1.5">
                    Gastos fijos mensuales (COP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                    <input
                      id="expenses"
                      type="text"
                      inputMode="numeric"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(formatCOP(e.target.value))}
                      placeholder="2.000.000"
                      className="w-full pl-8 pr-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <p className="text-text-muted text-xs mt-1">Arriendo, servicios, transporte, mercado, etc.</p>
                  {errors.monthlyExpenses && (
                    <p className="text-red-400 text-xs mt-1">{errors.monthlyExpenses}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Savings */}
          {step === 2 && (
            <div>
              <h1 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                Tu liquidez actual
              </h1>
              <p className="text-text-secondary mb-8">
                ¿Con cuánto cuentas hoy en ahorro o disponible para emergencias?
              </p>

              <div>
                <label htmlFor="savings" className="block text-sm font-medium text-text-secondary mb-1.5">
                  Ahorro / liquidez disponible (COP)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
                  <input
                    id="savings"
                    type="text"
                    inputMode="numeric"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(formatCOP(e.target.value))}
                    placeholder="5.000.000"
                    className="w-full pl-8 pr-4 py-3 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <p className="text-text-muted text-xs mt-1">
                  Cuenta de ahorros, CDT, efectivo, o cualquier recurso líquido.
                </p>
                {errors.currentSavings && (
                  <p className="text-red-400 text-xs mt-1">{errors.currentSavings}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Debts */}
          {step === 3 && (
            <div>
              <h1 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                Tus deudas
              </h1>
              <p className="text-text-secondary mb-8">
                ¿Tienes deudas activas? Créditos, tarjetas, préstamos...
              </p>

              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => { setHasDebts(true); setErrors({}); }}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    hasDebts === true
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-secondary hover:border-accent/40"
                  }`}
                >
                  Sí, tengo deudas
                </button>
                <button
                  type="button"
                  onClick={() => { setHasDebts(false); setErrors({}); }}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    hasDebts === false
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-text-secondary hover:border-accent/40"
                  }`}
                >
                  No tengo deudas
                </button>
              </div>
              {errors.hasDebts && <p className="text-red-400 text-xs mb-4">{errors.hasDebts}</p>}

              {hasDebts && (
                <div className="space-y-4">
                  {debts.map((debt, index) => (
                    <div key={debt.id} className="card-gradient-border p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-text-primary">
                          Deuda {index + 1}
                        </span>
                        {debts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDebt(index)}
                            className="text-xs text-text-muted hover:text-red-400 transition-colors"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={debt.name}
                          onChange={(e) => updateDebt(index, "name", e.target.value)}
                          placeholder="Nombre (ej: Tarjeta Visa, Crédito libre inversión)"
                          className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-text-muted mb-1">Saldo (COP)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">$</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={debt.balance}
                                onChange={(e) => updateDebt(index, "balance", e.target.value)}
                                placeholder="10.000.000"
                                className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                              />
                            </div>
                            {errors[`debt_balance_${index}`] && (
                              <p className="text-red-400 text-xs mt-1">{errors[`debt_balance_${index}`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs text-text-muted mb-1">Cuota mensual (COP)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">$</span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={debt.monthly_payment}
                                onChange={(e) => updateDebt(index, "monthly_payment", e.target.value)}
                                placeholder="500.000"
                                className="w-full pl-7 pr-3 py-2.5 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                              />
                            </div>
                            {errors[`debt_payment_${index}`] && (
                              <p className="text-red-400 text-xs mt-1">{errors[`debt_payment_${index}`]}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-text-muted mb-1">Tasa de interés aprox. (% E.A.)</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={debt.interest_rate}
                            onChange={(e) => {
                              const v = e.target.value.replace(/[^0-9.,]/g, "");
                              updateDebt(index, "interest_rate", v);
                            }}
                            placeholder="28.5"
                            className="w-full px-4 py-2.5 rounded-lg bg-bg-secondary border border-border text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDebt}
                    className="w-full py-2.5 rounded-lg border border-dashed border-border text-sm text-text-secondary hover:border-accent/40 hover:text-accent transition-colors"
                  >
                    + Agregar otra deuda
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Financial Goal */}
          {step === 4 && (
            <div>
              <h1 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                Tu objetivo principal
              </h1>
              <p className="text-text-secondary mb-8">
                ¿Qué te trajo a FAMA? Esto nos ayuda a personalizar tu experiencia.
              </p>

              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => { setFinancialGoal(goal); setErrors({}); }}
                    className={`w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-colors ${
                      financialGoal === goal
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-text-secondary hover:border-accent/40"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              {errors.financialGoal && (
                <p className="text-red-400 text-xs mt-2">{errors.financialGoal}</p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
              >
                Atrás
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="px-8 py-2.5 rounded-lg bg-accent text-bg-primary font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando..." : step === TOTAL_STEPS ? "Finalizar" : "Continuar"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
