import Link from "next/link";
import { RankingItem } from "@/lib/api";
import { faPrice, faCompact, faPercent, num, scoreTier } from "@/lib/format";

const tier = {
  excellent: {
    bar: "bg-gradient-to-r from-brand-600 to-brand-400",
    text: "text-brand-600 dark:text-brand-400",
    ring: "ring-brand-500/30",
    label: "عالی",
    glow: "shadow-brand-500/20",
  },
  good: {
    bar: "bg-gradient-to-r from-teal-600 to-teal-400",
    text: "text-teal-600 dark:text-teal-400",
    ring: "ring-teal-500/20",
    label: "خوب",
    glow: "shadow-teal-500/20",
  },
  fair: {
    bar: "bg-gradient-to-r from-amber-600 to-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/20",
    label: "متوسط",
    glow: "shadow-amber-500/20",
  },
  weak: {
    bar: "bg-gradient-to-r from-red-600 to-red-400",
    text: "text-red-600 dark:text-red-400",
    ring: "ring-red-500/20",
    label: "ضعیف",
    glow: "shadow-red-500/20",
  },
} as const;

const confBadge = {
  high: "bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-500/10 dark:to-brand-500/20 text-brand-700 dark:text-brand-400 border-brand-200 dark:border-brand-500/30 hover:shadow-sm transition-shadow",
  medium: "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-500/10 dark:to-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 hover:shadow-sm transition-shadow",
  low: "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-500/10 dark:to-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30 hover:shadow-sm transition-shadow",
  non_calculable: "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-500/10 dark:to-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/30 hover:shadow-sm transition-shadow",
} as const;

const confFa = {
  high: "اطمینان بالا",
  medium: "اطمینان متوسط",
  low: "اطمینان کم",
  non_calculable: "بدون P/E",
} as const;

type Confidence = keyof typeof confFa;

export default function StockCard({ stock }: { stock: RankingItem }) {
  const price = num(stock.currentPrice);
  const change = num(stock.priceChangePercent);
  const pe = num(stock.forwardPe);
  const eps = num(stock.estimatedAnnualEps);
  const score = num(stock.attractivenessScore) ?? 0;
  const volume = num(stock.dailyVolume);
  const t = tier[scoreTier(score)];

  const confKey = (stock.confidence in confBadge
    ? (stock.confidence as Confidence)
    : "non_calculable") as Confidence;

  const changeColor =
    change === null
      ? "text-muted"
      : change > 0
        ? "text-emerald-600 dark:text-emerald-400"
        : change < 0
          ? "text-red-600 dark:text-red-400"
          : "text-muted";

  const peColor =
    pe === null
      ? "text-muted"
      : pe < 5
        ? "text-emerald-600 dark:text-emerald-400"
        : pe < 10
          ? "text-teal-600 dark:text-teal-400"
          : pe < 20
            ? "text-fg"
            : "text-muted";

  return (
    <Link
      href={`/stocks/${encodeURIComponent(stock.symbol)}`}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/60"
    >
      <article
        className={`relative h-full rounded-2xl bg-surface border border-app
                    ring-1 ring-inset ${t.ring} p-5 flex flex-col gap-4
                    transition-all duration-300
                    group-hover:-translate-y-1 group-hover:shadow-2xl ${t.glow}
                    dark:group-hover:shadow-black/40 shadow-gray-200/40`}
      >
        {/* Rank pill with animated background */}
        <div
          className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-surface border border-app
                     flex items-center justify-center text-xs font-bold tabular transition-all duration-300
                     group-hover:scale-110 group-hover:shadow-md"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          <span className="relative z-10">{stock.rank}</span>
        </div>

        {/* Header with gradient accent */}
        <header className="flex justify-between items-start gap-3 group-hover:mb-2 transition-all">
          <div className="min-w-0">
            <h3 className="font-bold text-lg leading-tight truncate text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {stock.symbol}
            </h3>
            <p className="text-xs text-muted truncate mt-1">{stock.name}</p>
            <p className="text-[10px] text-muted/60 mt-2 inline-block px-2 py-0.5 rounded-full bg-surface-2">
              {stock.sector}
            </p>
          </div>
          <div className="relative group-hover:scale-105 transition-transform duration-300">
            <span
              className={`text-[10px] px-2.5 py-1.5 rounded-full border transition-all hover:shadow-sm ${confBadge[confKey]}`}
              title={
                confKey === "non_calculable"
                  ? "صورت مالی فصلی در دسترس نیست؛ P/E محاسبه نشد"
                  : undefined
              }
            >
              {confFa[confKey]}
            </span>
          </div>
        </header>

        {/* Score bar with animated progress */}
        <div className="transition-all duration-500 group-hover:opacity-100 opacity-70">
          <div className="flex justify-between items-baseline mb-2 group-hover:mb-2 transition-all">
            <span className="text-[10px] text-muted flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
              امتیاز جذابیت
            </span>
            <div className="flex items-baseline gap-2 group-hover:gap-1 transition-all">
              <span className={`text-[11px] font-semibold ${t.text}`}>
                {t.label}
              </span>
              <span className={`text-2xl font-bold tabular ${t.text} transition-transform group-hover:scale-105`}>
                {(score * 100).toFixed(0)}
              </span>
            </div>
          </div>
          <div className="relative h-2 rounded-full bg-surface-2 overflow-hidden group-hover:h-2.5 transition-all">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${t.bar}`}
              style={{ width: `${Math.min(100, score * 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
            </div>
            <div className="absolute right-0 top-0 h-full w-2 bg-white/40 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Price row with improved layout */}
        <div className="flex justify-between items-end pt-2 group-hover:pt-3 transition-all border-t border-app border-dashed">
          <div className="flex-1">
            <p className="text-[10px] text-muted mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              آخرین قیمت
            </p>
            <p className="text-2xl font-bold tabular leading-none text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {price !== null ? faPrice(price) : "—"}
            </p>
            <p className="text-[9px] text-muted/60 mt-1">ریال</p>
          </div>
          <div className="text-right ml-4 flex-shrink-0">
            <p className="text-[10px] text-muted mb-1 flex items-center justify-end gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              تغییر روز
            </p>
            <p className={`text-lg font-bold tabular leading-none ${changeColor}`}>
              {change !== null ? faPercent(change) : "—"}
            </p>
          </div>
        </div>

        {/* Metrics row with improved spacing */}
        <div className="grid grid-cols-3 gap-2 pt-4 group-hover:gap-3 transition-all">
          <Metric
            label="P/E آینده"
            value={pe !== null ? pe.toFixed(2) : "—"}
            accent={confKey === "non_calculable" ? "text-muted" : peColor}
          />
          <Metric
            label="EPS"
            value={eps !== null ? faPrice(eps) : "—"}
          />
          <Metric
            label="حجم"
            value={volume !== null ? faCompact(volume) : "—"}
          />
        </div>
      </article>
    </Link>
  );
}

function Metric({
  label,
  value,
  accent = "text-fg",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="group/metric">
      <p className="text-[10px] text-muted mb-1 group-hover/metric:text-brand-600 dark:group-hover/metric:text-brand-400 transition-colors">
        {label}
      </p>
      <p className={`text-sm font-semibold tabular ${accent} group-hover/metric:scale-105 transition-transform`}>
        {value}
      </p>
    </div>
  );
}