import Navbar from "./components/Navbar";
import DashboardMock from "./components/DashboardMock";
import FAQAccordion from "./components/FAQAccordion";

/* ─── Icon helpers ─── */
function IconChat() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
function IconScan() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}
function IconChart() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );
}
function IconSimulator() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
function IconBalance() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ─── Section wrapper ─── */
function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-4">
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-text-primary mb-4">
      {children}
    </h2>
  );
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-text-secondary text-lg max-w-2xl mx-auto">{children}</p>;
}

/* ─── PAGE ─── */
export default function Home() {
  const features = [
    {
      icon: <IconChat />,
      title: "Onboarding conversacional",
      description:
        "Respondé preguntas simples en vez de llenar formularios. FAMA entiende tu situación en minutos.",
    },
    {
      icon: <IconScan />,
      title: "Radiografía financiera",
      description:
        "Visualizá ingresos, gastos fijos, deudas y ahorro en un solo tablero claro y accionable.",
    },
    {
      icon: <IconChart />,
      title: "Proyección a 12 meses",
      description:
        "Mirá hacia dónde va tu plata mes a mes. Anticipá problemas antes de que lleguen.",
    },
    {
      icon: <IconSimulator />,
      title: 'Simulador "¿Qué pasa si...?"',
      description:
        "Simulá decisiones reales: ¿compro? ¿cambio de trabajo? ¿adelanto cuotas? Mirá el impacto antes de actuar.",
    },
    {
      icon: <IconBalance />,
      title: "Módulo deuda vs liquidez",
      description:
        "FAMA te ayuda a elegir: ¿pagar deuda o guardar caja? Con números, no con opiniones.",
    },
  ];

  const benefits = [
    "Pensado 100% para Colombia: valores en COP, contexto local, lenguaje claro.",
    "No necesitás ser experto en finanzas. FAMA te guía paso a paso.",
    "Decisiones con datos, no con estrés. Proyectá antes de mover un peso.",
    "Privacidad primero: tus datos nunca se comparten con terceros.",
    "Funciona en tu celular, tablet o computador. Sin descargar nada.",
  ];

  const faqs = [
    {
      q: "¿Qué es FAMA exactamente?",
      a: "FAMA es un copiloto financiero personal que te ayuda a proyectar tus finanzas a 12 meses, simular decisiones reales y elegir entre pagar deuda o mantener liquidez. Todo en español y pensado para Colombia.",
    },
    {
      q: "¿Necesito conectar mi cuenta bancaria?",
      a: "No. FAMA funciona con la información que vos le das. No se conecta a bancos ni requiere acceso a tus cuentas. Tu privacidad es prioridad.",
    },
    {
      q: "¿Cuánto cuesta después de la prueba gratis?",
      a: "Después de los 7 días de prueba gratuita, el plan es de COP $29.900/mes. Podés cancelar en cualquier momento sin compromisos.",
    },
    {
      q: "¿Funciona para independientes o solo empleados?",
      a: "FAMA funciona para cualquier persona: empleados, independientes, freelancers, hogares. Se adapta a tu tipo de ingreso y situación.",
    },
    {
      q: "¿Mis datos están seguros?",
      a: "Sí. Usamos encriptación de extremo a extremo y nunca compartimos tu información con terceros. Tus datos financieros son solo tuyos.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* ───────── HERO ───────── */}
      <Section className="pt-32 sm:pt-40 grid-bg relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionLabel>Copiloto financiero para Colombia</SectionLabel>
            <h1 className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-text-primary mb-6">
              Decide mejor con tu plata{" "}
              <span className="text-accent glow-text">antes de actuar</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-xl mb-8 leading-relaxed">
              FAMA proyecta tus próximos 12 meses, simula escenarios reales y te ayuda a elegir
              entre liquidez y deuda con claridad, en español y pensado para Colombia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#precios"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-accent text-bg-primary font-semibold text-base hover:bg-accent-hover transition-colors glow-accent"
              >
                Empezar prueba gratis
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-border text-text-secondary font-semibold text-base hover:border-accent/40 hover:text-accent transition-colors"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>

          <div className="relative lg:pl-4">
            <DashboardMock />
          </div>
        </div>
      </Section>

      {/* ───────── PROBLEMA ───────── */}
      <Section>
        <div className="text-center mb-14">
          <SectionLabel>El problema</SectionLabel>
          <SectionTitle>Las apps de finanzas te muestran el pasado. Vos necesitás ver el futuro.</SectionTitle>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "📊",
              title: "Registrar gastos no alcanza",
              desc: "Sabés cuánto gastaste, pero no sabés si te va a alcanzar el próximo mes. Falta visión hacia adelante.",
            },
            {
              emoji: "⚖️",
              title: "¿Pagar deuda o guardar caja?",
              desc: "La pregunta más difícil de las finanzas personales. Sin datos, cualquier decisión es un tiro al aire.",
            },
            {
              emoji: "🔮",
              title: "Cero visibilidad del futuro",
              desc: "No tenés idea de cómo van a estar tus finanzas en 6 o 12 meses. Eso genera ansiedad y malas decisiones.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="card-gradient-border p-6 sm:p-8 hover:bg-bg-card-hover transition-colors"
            >
              <span className="text-3xl mb-4 block">{item.emoji}</span>
              <h3 className="font-[family-name:var(--font-sora)] text-lg font-semibold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────── CÓMO FUNCIONA ───────── */}
      <Section id="como-funciona" className="bg-bg-secondary">
        <div className="text-center mb-14">
          <SectionLabel>Cómo funciona</SectionLabel>
          <SectionTitle>Tres pasos para tomar el control</SectionTitle>
          <SectionSubtitle>Sin formularios largos, sin jerga financiera, sin conectar tu banco.</SectionSubtitle>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Conectá tu situación actual",
              desc: "Respondé preguntas simples sobre tus ingresos, gastos y deudas. FAMA arma tu panorama en minutos.",
            },
            {
              step: "02",
              title: "Simulá una decisión real",
              desc: '¿Cambiar de trabajo? ¿Adelantar cuotas? ¿Comprar algo grande? Usá el simulador "¿Qué pasa si...?" y mirá el impacto.',
            },
            {
              step: "03",
              title: "Entendé qué hacer después",
              desc: "FAMA te da recomendaciones claras: cuándo pagar, cuándo ahorrar, y qué priorizar según tu situación.",
            },
          ].map((item) => (
            <div key={item.step} className="relative">
              <span className="font-[family-name:var(--font-sora)] text-5xl font-bold text-accent/15 absolute -top-2 -left-1">
                {item.step}
              </span>
              <div className="pt-12">
                <h3 className="font-[family-name:var(--font-sora)] text-lg font-semibold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────── FEATURES ───────── */}
      <Section id="producto">
        <div className="text-center mb-14">
          <SectionLabel>Producto</SectionLabel>
          <SectionTitle>Todo lo que necesitás para decidir con claridad</SectionTitle>
          <SectionSubtitle>
            Cinco herramientas diseñadas para que entiendas tu plata sin ser experto.
          </SectionSubtitle>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="card-gradient-border p-6 sm:p-8 hover:bg-bg-card-hover transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                {f.icon}
              </div>
              <h3 className="font-[family-name:var(--font-sora)] text-lg font-semibold text-text-primary mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ───────── BENEFICIOS ───────── */}
      <Section className="bg-bg-secondary">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionLabel>Beneficios</SectionLabel>
            <SectionTitle>Hecho para Colombia, pensado para vos</SectionTitle>
            <SectionSubtitle>
              FAMA habla tu idioma, maneja pesos colombianos y entiende la realidad financiera local.
            </SectionSubtitle>
          </div>
          <ul className="space-y-4">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">
                  <IconCheck />
                </span>
                <span className="text-text-secondary leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ───────── PRECIOS ───────── */}
      <Section id="precios">
        <div className="text-center mb-14">
          <SectionLabel>Precios</SectionLabel>
          <SectionTitle>Simple, transparente, sin sorpresas</SectionTitle>
        </div>
        <div className="max-w-md mx-auto card-gradient-border p-8 sm:p-10 text-center glow-accent">
          <p className="text-sm text-accent font-semibold uppercase tracking-wider mb-2">Plan único</p>
          <div className="mb-1">
            <span className="font-[family-name:var(--font-sora)] text-5xl font-bold text-text-primary">
              $29.900
            </span>
            <span className="text-text-muted text-lg"> COP/mes</span>
          </div>
          <p className="text-text-secondary text-sm mb-8">7 días de prueba gratis · Cancelá cuando quieras</p>

          <ul className="text-left space-y-3 mb-8">
            {[
              "Onboarding conversacional",
              "Radiografía financiera completa",
              "Proyección a 12 meses",
              'Simulador "¿Qué pasa si...?"',
              "Módulo deuda vs liquidez",
              "Actualizaciones y nuevas funciones",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <IconCheck />
                <span className="text-sm text-text-secondary">{item}</span>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="block w-full py-3.5 rounded-xl bg-accent text-bg-primary font-semibold text-base hover:bg-accent-hover transition-colors"
          >
            Empezar prueba gratis
          </a>
          <p className="text-xs text-text-muted mt-3">No se cobra hasta que termine la prueba</p>
        </div>
      </Section>

      {/* ───────── FAQ ───────── */}
      <Section id="faq" className="bg-bg-secondary">
        <div className="text-center mb-14">
          <SectionLabel>Preguntas frecuentes</SectionLabel>
          <SectionTitle>¿Tenés dudas? Acá las resolvemos</SectionTitle>
        </div>
        <div className="max-w-2xl mx-auto">
          <FAQAccordion faqs={faqs} />
        </div>
      </Section>

      {/* ───────── FOOTER CTA ───────── */}
      <Section>
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Tomá el control de tu plata hoy
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-8">
            Empezá gratis, sin tarjeta de crédito. Descubrí qué pasa con tu dinero en los próximos
            12 meses.
          </p>
          <a
            href="#precios"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-accent text-bg-primary font-semibold text-lg hover:bg-accent-hover transition-colors glow-accent"
          >
            Empezar prueba gratis
          </a>
        </div>
      </Section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="font-[family-name:var(--font-sora)] text-bg-primary font-bold text-xs">
                F
              </span>
            </div>
            <span className="font-[family-name:var(--font-sora)] text-sm font-semibold text-text-primary">
              FAMA
            </span>
          </div>
          <p className="text-xs text-text-muted">
            © 2025 FAMA. Todos los derechos reservados. info@example.com
          </p>
          <div className="flex gap-6">
            {["Términos", "Privacidad", "Contacto"].map((link) => (
              <a key={link} href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
