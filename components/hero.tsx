type HeroStats = {
  avgScore: number;
  gainers: number;
  losers: number;
};

const particles = Array.from({ length: 12 }, (_, id) => ({
  id,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 5 + 2,
  delay: Math.random() * 5,
}));

export function Hero({
  generatedAt,
  total,
  stats,
}: {
  generatedAt?: string;
  total?: number;
  stats?: HeroStats | null;
}) {


  const formatNumber = (value: number) =>
    value.toLocaleString("fa-IR");

  const marketTotal =
    stats ? stats.gainers + stats.losers : 0;

  const gainersPercent =
    marketTotal > 0
      ? Math.round((stats!.gainers / marketTotal) * 100)
      : 0;

  return (
    <section
      dir="rtl"
      className="relative isolate overflow-hidden bg-linear-to-b from-brand-50 via-white to-white py-16 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 md:py-24"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl md:h-96 md:w-96" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand-400/15 blur-3xl md:h-96 md:w-96" />

        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-emerald-500/30 motion-safe:animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            تحلیل هوشمند بازار سرمایه
          </div>

          <h1 className="text-3xl font-black leading-[1.7] tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
            سهام برتر بورس را
            <span className="block bg-gradient-to-l from-emerald-600 via-teal-500 to-brand-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-brand-400">
              هوشمندانه شناسایی کن
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-400 sm:text-base md:text-lg">
            ارزیابی جذابیت نمادهای بورس تهران بر اساس فروش ماهانه،
            حاشیه سود واقعی و نسبت P/E آینده‌نگر؛
            برای تصمیم‌گیری آگاهانه‌تر در بازار سرمایه.
          </p>

          {generatedAt && (
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
              آخرین به‌روزرسانی داده‌ها: {generatedAt}
            </p>
          )}
        </div>

        {/* Statistics */}
        {(total !== undefined || stats) && (
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {/* Total symbols */}
            {total !== undefined && (
              <StatCard
                label="نمادهای بررسی‌شده"
                value={formatNumber(total)}
                description="نماد موجود در سامانه تحلیل"
                accent="cyan"
                icon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <path d="M8 9h8M8 13h5M8 17h3" />
                  </svg>
                }
              >
                {stats && (
                  <div className="mt-4 border-t border-slate-200/70 pt-3 dark:border-slate-700/70">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>میانگین امتیاز جذابیت</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {formatNumber(stats.avgScore)}
                        <span className="mr-1 font-normal">از ۱۰۰</span>
                      </span>
                    </div>
                  </div>
                )}
              </StatCard>
            )}

            {/* Average score */}
            {stats && (
              <StatCard
                label="میانگین جذابیت"
                value={formatNumber(stats.avgScore)}
                description="امتیاز میانگین نمادها"
                accent="violet"
                icon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
                  </svg>
                }
              >
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-linear-to-l from-violet-500 to-brand-500 transition-[width] duration-700"
                    style={{
                      width: `${Math.min(100, Math.max(0, stats.avgScore))}%`,
                    }}
                  />
                </div>
              </StatCard>
            )}

            {/* Market sentiment */}
            {stats && (
              <StatCard
                label="وضعیت نمادها"
                value={`${gainersPercent}٪`}
                description="سهم نمادهای صعودی از مجموع صعودی و نزولی"
                accent="emerald"
                icon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 17 9 11l4 4 8-9" />
                    <path d="M15 6h6v6" />
                  </svg>
                }
              >
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      صعودی {formatNumber(stats.gainers)}
                    </span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">
                      نزولی {formatNumber(stats.losers)}
                    </span>
                  </div>

                  <div
                    className="flex h-2 overflow-hidden rounded-full bg-rose-500/80"
                    role="img"
                    aria-label={`صعودی ${stats.gainers} نماد، نزولی ${stats.losers} نماد`}
                  >
                    <div
                      className="h-full bg-emerald-500 transition-[width] duration-700"
                      style={{ width: `${gainersPercent}%` }}
                    />
                  </div>
                </div>
              </StatCard>
            )}
          </div>
        )}

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-2 text-slate-400">
          <span className="text-xs">کشف فرصت‌های بازار</span>
          <svg
            aria-hidden="true"
            className="h-5 w-5 motion-safe:animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="m7 10 5 5 5-5" />
          </svg>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(12px, -22px, 0);
          }
        }

        .animate-float {
          animation: float 9s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-float {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function StatCard({
  label,
  value,
  description,
  accent,
  icon,
  children,
}: {
  label: string;
  value: string;
  description: string;
  accent: "cyan" | "violet" | "emerald";
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  const accents = {
    cyan: {
      icon: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      glow: "group-hover:border-cyan-500/30",
    },
    violet: {
      icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      glow: "group-hover:border-violet-500/30",
    },
    emerald: {
      icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      glow: "group-hover:border-emerald-500/30",
    },
  };

  return (
    <article
      className={`group rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/70 dark:bg-slate-900/70 ${accents[accent].glow}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
          <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${accents[accent].icon}`}
        >
          <span className="h-6 w-6 [&>svg]:h-full [&>svg]:w-full [&>svg]:stroke-current [&>svg]:stroke-[1.7]">
            {icon}
          </span>
        </div>
      </div>

      {children}
    </article>
  );
}