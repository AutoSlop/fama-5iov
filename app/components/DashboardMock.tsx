export default function DashboardMock() {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const balanceValues = [42, 48, 45, 52, 58, 55, 62, 68, 72, 75, 80, 85];
  const debtValues = [65, 60, 58, 55, 50, 48, 45, 42, 38, 35, 32, 28];

  const maxVal = 100;
  const chartH = 120;
  const chartW = 320;
  const padX = 0;

  const toPath = (values: number[]) => {
    const step = (chartW - padX * 2) / (values.length - 1);
    return values
      .map((v, i) => {
        const x = padX + i * step;
        const y = chartH - (v / maxVal) * chartH;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  };

  const toArea = (values: number[]) => {
    const step = (chartW - padX * 2) / (values.length - 1);
    const path = values
      .map((v, i) => {
        const x = padX + i * step;
        const y = chartH - (v / maxVal) * chartH;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
    const lastX = padX + (values.length - 1) * step;
    return `${path} L${lastX},${chartH} L${padX},${chartH} Z`;
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main dashboard card */}
      <div className="card-gradient-border p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">Proyección 12 meses</p>
            <p className="font-[family-name:var(--font-sora)] text-lg font-bold text-text-primary mt-0.5">
              COP $4.280.000
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +12.4%
          </div>
        </div>

        {/* Chart */}
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <line
              key={v}
              x1={0}
              y1={chartH - (v / maxVal) * chartH}
              x2={chartW}
              y2={chartH - (v / maxVal) * chartH}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={0.5}
            />
          ))}
          {/* Balance area */}
          <path d={toArea(balanceValues)} fill="url(#balanceGrad)" opacity={0.3} />
          {/* Debt area */}
          <path d={toArea(debtValues)} fill="url(#debtGrad)" opacity={0.2} />
          {/* Balance line */}
          <path d={toPath(balanceValues)} fill="none" stroke="#00D9A3" strokeWidth={2} strokeLinecap="round" />
          {/* Debt line */}
          <path d={toPath(debtValues)} fill="none" stroke="#FFC857" strokeWidth={2} strokeLinecap="round" strokeDasharray="6 3" />
          {/* Gradients */}
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D9A3" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#00D9A3" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC857" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#FFC857" stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>

        {/* Month labels */}
        <div className="flex justify-between mt-2 px-0">
          {months.map((m, i) => (
            <span key={i} className="text-[9px] text-text-muted">
              {m}
            </span>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-accent rounded-full" />
            <span className="text-xs text-text-secondary">Liquidez</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-accent-secondary rounded-full opacity-80" />
            <span className="text-xs text-text-secondary">Deuda</span>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Ahorro mensual", value: "COP $380K", color: "text-accent" },
            { label: "Deuda pendiente", value: "COP $2.1M", color: "text-accent-secondary" },
            { label: "Score salud", value: "74/100", color: "text-text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg-primary/50 rounded-lg p-3">
              <p className="text-[10px] text-text-muted">{stat.label}</p>
              <p className={`text-sm font-semibold mt-0.5 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating card */}
      <div className="absolute -bottom-4 -right-2 sm:-right-4 card-gradient-border p-3 w-48 glow-accent">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-[10px] text-text-muted">¿Qué pasa si...?</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Adelantas $500K de deuda → ahorras <span className="text-accent font-semibold">$42K</span> en intereses
        </p>
      </div>
    </div>
  );
}
