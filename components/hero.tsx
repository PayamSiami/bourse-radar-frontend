"use client";

import { useEffect, useState } from "react";

export function Hero({
  generatedAt,
  total,
  stats,
}: {
  generatedAt?: string;
  total?: number;
  stats?: { avgScore: number; gainers: number; losers: number } | null;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="brand-gradient pt-20 pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-200/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        {/* Subtitle */}
        <p
          className={`text-lg md:text-xl text-muted mt-6 leading-8 max-w-3xl mx-auto transition-all duration-1000 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          ارزیابی جذابیت سهام بورس تهران بر اساس فروش ماهانه، حاشیه سود واقعی،
          و نسبت P/E آینده‌نگر.
        </p>

        {/* Stats cards */}
        {generatedAt && (
          <div
            className={`mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {/* Latest Update */}
            <div className="bg-surface/80 backdrop-blur-sm border border-app rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-2xl md:text-3xl font-bold text-fg tabular-nums">
                {new Date(generatedAt).getFullYear() + 1403}
              </div>
              <div className="text-xs text-muted mt-1">آخرین داده</div>
            </div>

            {/* Total Symbols */}
            {total !== undefined && (
              <div className="bg-surface/80 backdrop-blur-sm border border-app rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl md:text-3xl font-bold text-fg tabular-nums">
                  {total.toLocaleString("fa-IR")}
                </div>
                <div className="text-xs text-muted mt-1">نماد فعال</div>
              </div>
            )}

            {/* Avg Score */}
            {stats && (
              <div className="bg-surface/80 backdrop-blur-sm border border-app rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-2xl md:text-3xl font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                  {stats.avgScore}
                </div>
                <div className="text-xs text-muted mt-1">میانگین امتیاز</div>
              </div>
            )}

            {/* Market Status */}
            {stats && (
              <div className="bg-surface/80 backdrop-blur-sm border border-app rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-lg md:text-xl font-bold text-fg tabular-nums">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {stats.gainers}▲
                  </span>
                  <span className="text-muted mx-1">/</span>
                  <span className="text-red-600 dark:text-red-400">
                    {stats.losers}▼
                  </span>
                </div>
                <div className="text-xs text-muted mt-1">صعودی/نزولی</div>
              </div>
            )}
          </div>
        )}

        {/* Animated pulse effect at bottom */}
        <div className="mt-12 flex justify-center opacity-50" aria-hidden="true">
          <svg className="h-6 w-6 text-muted animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}