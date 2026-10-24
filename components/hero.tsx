"use client";

import type { ReactNode } from "react";

type HeroStats = {
  avgScore: number;
  gainers: number;
  losers: number;
};

type HeroProps = {
  generatedAt?: string;
  total?: number;
  stats?: HeroStats | null;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 2,
  }).format(value);

function StatIcon({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/70 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
      {children}
    </span>
  );
}

export function Hero({
  generatedAt,
  total,
  stats,
}: HeroProps) {
  const marketTotal = stats
    ? Math.max(0, stats.gainers) + Math.max(0, stats.losers)
    : 0;

  const gainersPercent =
    marketTotal > 0 && stats
      ? Math.round(
          (Math.max(0, stats.gainers) / marketTotal) * 100
        )
      : 0;

  const score = stats
    ? Math.min(100, Math.max(0, stats.avgScore))
    : 0;

  const hasStats = total !== undefined || stats != null;

  return (
    <section
      dir="rtl"
      className="relative isolate overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-emerald-50/80 via-white to-white dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl sm:h-[28rem] sm:w-[28rem]" />

        <div className="absolute -left-32 top-32 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-l from-transparent via-emerald-500/30 to-transparent" />

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045]"
          style={{
            backgroundImage:
              "radial-gradient(#64748b 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        {/* Main introduction */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-md dark:border-emerald-800/60 dark:bg-slate-900/80 dark:text-emerald-300 sm:text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40 motion-reduce:animate-none" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            تحلیل هوشمند بازار سرمایه
            <span className="mx-1 h-3.5 w-px bg-emerald-200 dark:bg-emerald-800" />
            <span className="text-emerald-600 dark:text-emerald-400">
              بورس تهران
            </span>
          </div>

          <h1 className="text-3xl font-black leading-[1.8] tracking-tight text-slate-950 dark:text-white sm:text-4xl sm:leading-[1.65] md:text-5xl lg:text-6xl">
            فرصت‌های بازار را
            <span className="block bg-linear-to-l from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-blue-400">
              هوشمندانه شناسایی کن
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-400 sm:mt-6 sm:text-base sm:leading-9">
            تحلیل نمادهای بورس تهران بر اساس روند فروش ماهانه،
            حاشیه سود و نسبت P/E آینده‌نگر؛ برای بررسی دقیق‌تر
            فرصت‌های سرمایه‌گذاری و تصمیم‌گیری آگاهانه‌تر.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href="#stocks"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30 motion-reduce:transform-none motion-reduce:transition-none"
            >
              مشاهده نمادهای برتر
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </a>

            <a
              href="#analysis-method"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40"
            >
              آشنایی با روش تحلیل
            </a>
          </div>

          {generatedAt && (
            <div className="mt-6 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-lg bg-white/60 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <svg
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span>آخرین به‌روزرسانی داده‌ها:</span>
              <time>{generatedAt}</time>
            </div>
          )}
        </div>

        {/* Statistics */}
        {hasStats && (
          <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
            {/* Total symbols */}
            {total !== undefined && (
              <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-950/5 dark:border-slate-700/80 dark:bg-slate-900/80 dark:hover:border-cyan-800 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      نمادهای بررسی‌شده
                    </p>

                    <p className="mt-3 text-3xl font-black tabular-nums tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                      {formatNumber(total)}
                    </p>

                    <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                      نماد موجود در سامانه تحلیل
                    </p>
                  </div>

                  <StatIcon>
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="16" rx="3" />
                      <path d="M8 9h8M8 13h5M8 17h3" />
                    </svg>
                  </StatIcon>
                </div>

                {stats && (
                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        میانگین امتیاز جذابیت
                      </span>
                      <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                        {formatNumber(stats.avgScore)}
                        <span className="mr-1 font-normal text-slate-500">
                          از ۱۰۰
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </article>
            )}

            {/* Average score */}
            {stats && (
              <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-950/5 dark:border-slate-700/80 dark:bg-slate-900/80 dark:hover:border-violet-800 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      میانگین جذابیت
                    </p>

                    <p className="mt-3 text-3xl font-black tabular-nums tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                      {formatNumber(stats.avgScore)}
                      <span className="mr-1 text-sm font-semibold text-slate-400">
                        / ۱۰۰
                      </span>
                    </p>

                    <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                      امتیاز میانگین نمادهای تحلیل‌شده
                    </p>
                  </div>

                  <StatIcon>
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-violet-600 dark:text-violet-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
                    </svg>
                  </StatIcon>
                </div>

                <div
                  className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                  role="progressbar"
                  aria-label="میانگین امتیاز جذابیت"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={score}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-violet-500 to-indigo-500 transition-[width] duration-700 motion-reduce:transition-none"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </article>
            )}

            {/* Market sentiment */}
            {stats && (
              <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5 dark:border-slate-700/80 dark:bg-slate-900/80 dark:hover:border-emerald-800 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      وضعیت بازار
                    </p>

                    <p className="mt-3 text-3xl font-black tabular-nums tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                      {formatNumber(gainersPercent)}
                      <span className="mr-1 text-xl text-slate-400">
                        ٪
                      </span>
                    </p>

                    <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                      سهم نمادهای صعودی از نمادهای دارای وضعیت مشخص
                    </p>
                  </div>

                  <StatIcon>
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 17 9 11l4 4 8-9" />
                      <path d="M15 6h6v6" />
                    </svg>
                  </StatIcon>
                </div>

                <div className="mt-5">
                  <div className="mb-3 flex items-center justify-between gap-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      صعودی {formatNumber(stats.gainers)}
                    </span>

                    <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      نزولی {formatNumber(stats.losers)}
                    </span>
                  </div>

                  <div
                    className="flex h-2 overflow-hidden rounded-full bg-rose-500/80"
                    role="img"
                    aria-label={`صعودی ${formatNumber(stats.gainers)} نماد، نزولی ${formatNumber(stats.losers)} نماد`}
                  >
                    {marketTotal > 0 && (
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 motion-reduce:transition-none"
                        style={{ width: `${gainersPercent}%` }}
                      />
                    )}
                  </div>
                </div>
              </article>
            )}
          </div>
        )}

        {/* Bottom note */}
        <div className="mt-10 flex items-center justify-center gap-2 text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>

          <span>
            امتیازها ابزار غربالگری هستند و به‌تنهایی توصیه خرید یا فروش محسوب نمی‌شوند.
          </span>
        </div>
      </div>
    </section>
  );
}