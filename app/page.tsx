"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  fetchRankings,
  fetchSectors,
  type RankingItem,
  type SectorSummary,
} from "@/lib/api";

import { num } from "@/lib/format";
import StockCard from "@/components/StockCard";
import { SalesTrends } from "@/components/sales-trends";
import { Hero } from "@/components/hero";

type SortKey = "rank" | "score" | "pe" | "change" | "volume";

type Meta = {
  generatedAt?: string;
  count?: number;
};

const PAGE_SIZE = 18;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rank", label: "رتبه جذابیت" },
  { value: "score", label: "بیشترین امتیاز" },
  { value: "pe", label: "کمترین P/E آینده" },
  { value: "change", label: "بیشترین تغییر روزانه" },
  { value: "volume", label: "بیشترین حجم معاملات" },
];

function toNumber(value: unknown): number | null {
  return num(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export default function Home() {
  const [items, setItems] = useState<RankingItem[]>([]);
  const [sectors, setSectors] = useState<SectorSummary[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeSector, setActiveSector] = useState("");
  const [sort, setSort] = useState<SortKey>("rank");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const requestId = useRef(0);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    const id = ++requestId.current;

    setLoading(true);
    setError(null);

    try {
      const [rankingResult, sectorResult] = await Promise.all([
        fetchRankings(50),
        fetchSectors().catch(() => ({ data: [] as SectorSummary[] }))
      ]);

      if (id !== requestId.current) return;

      // اگر API پروژه خروجی متفاوتی دارد، این دو خط را
      // مطابق ساختار واقعی پاسخ API تنظیم کن.
      const rankingData = rankingResult as unknown as {
        items?: RankingItem[];
        data?: RankingItem[];
        generatedAt?: string;
        count?: number;
      } & RankingItem[];

      const rankingItems = Array.isArray(rankingResult)
        ? rankingResult
        : rankingData.items ?? rankingData.data ?? [];

      setItems(rankingItems);
      setSectors(sectorResult.data ?? []);
      setMeta({
        generatedAt: rankingData.generatedAt,
        count: rankingData.count ?? rankingItems.length,
      });
    } catch (err) {
      if (id !== requestId.current) return;

      setError(
        err instanceof Error
          ? err.message
          : "دریافت اطلاعات با خطا مواجه شد.",
      );
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load();

    return () => {
      requestId.current += 1;
    };
  }, [load]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = debouncedQuery.toLocaleLowerCase("fa-IR");

    const result = items.filter((stock) => {
      const matchesQuery =
        !normalizedQuery ||
        stock.symbol.toLocaleLowerCase("fa-IR").includes(normalizedQuery) ||
        stock.name.toLocaleLowerCase("fa-IR").includes(normalizedQuery);

      const matchesSector =
        !activeSector || stock.sector === activeSector;

      return matchesQuery && matchesSector;
    });

    result.sort((a, b) => {
      const aRank = toNumber(a.rank) ?? Number.MAX_SAFE_INTEGER;
      const bRank = toNumber(b.rank) ?? Number.MAX_SAFE_INTEGER;

      const aScore = toNumber(a.attractivenessScore) ?? -Infinity;
      const bScore = toNumber(b.attractivenessScore) ?? -Infinity;

      const aPe = toNumber(a.forwardPe);
      const bPe = toNumber(b.forwardPe);

      const aChange = toNumber(a.priceChangePercent) ?? -Infinity;
      const bChange = toNumber(b.priceChangePercent) ?? -Infinity;

      const aVolume = toNumber(a.dailyVolume) ?? -Infinity;
      const bVolume = toNumber(b.dailyVolume) ?? -Infinity;

      switch (sort) {
        case "score":
          return bScore - aScore;

        case "pe":
          if (aPe === null) return 1;
          if (bPe === null) return -1;
          return aPe - bPe;

        case "change":
          return bChange - aChange;

        case "volume":
          return bVolume - aVolume;

        case "rank":
        default:
          return aRank - bRank;
      }
    });

    return result;
  }, [items, debouncedQuery, activeSector, sort]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filteredItems]);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(current + PAGE_SIZE, filteredItems.length),
          );
        }
      },
      { rootMargin: "500px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [loading, filteredItems.length, visibleCount]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount],
  );

  const stats = useMemo(() => {
    let scoreTotal = 0;
    let scoreCount = 0;
    let gainers = 0;
    let losers = 0;

    for (const stock of filteredItems) {
      const score = toNumber(stock.attractivenessScore);
      const change = toNumber(stock.priceChangePercent);

      if (score !== null) {
        scoreTotal += score;
        scoreCount += 1;
      }

      if (change !== null && change > 0) gainers += 1;
      if (change !== null && change < 0) losers += 1;
    }

    return {
      avgScore: scoreCount ? scoreTotal / scoreCount : 0,
      gainers,
      losers,
      total: filteredItems.length,
    };
  }, [filteredItems]);

  const hasFilters = Boolean(query.trim() || activeSector);

  const clearFilters = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setActiveSector("");
    setSort("rank");
  }, []);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-app text-fg"
    >
      <Hero
        total={loading ? undefined : (meta?.count ?? items.length)}
        stats={{
          avgScore: Math.round(stats.avgScore * 100),
          gainers: stats.gainers,
          losers: stats.losers,
        }}
        generatedAt={meta?.generatedAt}
      />

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Search and filters */}
        <section
          aria-label="جستجو و فیلتر نمادها"
          className="relative z-10 -mt-6 rounded-3xl border border-app bg-surface p-4 shadow-lg sm:-mt-8 sm:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="min-w-0 flex-1">
              <label
                htmlFor="stock-search"
                className="mb-2 block text-sm font-semibold"
              >
                جستجوی نماد یا شرکت
              </label>

              <div className="relative">
                <svg
                  aria-hidden="true"
                  className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>

                <input
                  id="stock-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="مثلاً زشگزا یا نام شرکت..."
                  className="h-12 w-full rounded-2xl border border-app bg-surface-2 pr-12 pl-4 text-sm outline-none transition placeholder:text-muted/70 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="پاک کردن جستجو"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted transition hover:bg-surface hover:text-fg"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m18 6-12 12M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="w-full lg:w-64">
              <label
                htmlFor="stock-sort"
                className="mb-2 block text-sm font-semibold"
              >
                مرتب‌سازی بر اساس
              </label>

              <select
                id="stock-sort"
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortKey)
                }
                className="h-12 w-full rounded-2xl border border-app bg-surface-2 px-4 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sector filters */}
          {sectors.length > 0 && (
            <div className="mt-5 border-t border-app pt-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">فیلتر صنعت</h2>

                {activeSector && (
                  <button
                    type="button"
                    onClick={() => setActiveSector("")}
                    className="text-xs font-medium text-brand-600 transition hover:opacity-75 dark:text-brand-400"
                  >
                    حذف فیلتر صنعت
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setActiveSector("")}
                  aria-pressed={!activeSector}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${!activeSector
                    ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                    : "border-app bg-surface-2 text-muted hover:border-brand-500/50 hover:text-fg"
                    }`}
                >
                  همه صنایع
                  <span className="mr-2 text-xs opacity-80">
                    {formatNumber(items.length)}
                  </span>
                </button>

                {sectors.map((sector) => {
                  const sectorName = String(
                    (sector as SectorSummary & { sector?: string }).sector ??
                    (sector as SectorSummary & { name?: string }).name ??
                    "",
                  );

                  if (!sectorName) return null;

                  const isActive = activeSector === sectorName;

                  return (
                    <button
                      key={sectorName}
                      type="button"
                      onClick={() =>
                        setActiveSector(isActive ? "" : sectorName)
                      }
                      aria-pressed={isActive}
                      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${isActive
                        ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                        : "border-app bg-surface-2 text-muted hover:border-brand-500/50 hover:text-fg"
                        }`}
                    >
                      {sectorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Results header */}
        <section className="mb-5 mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-brand-600 dark:text-brand-400">
              تحلیل بازار سرمایه
            </p>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              رتبه‌بندی نمادها
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted">
              نمادها را بر اساس امتیاز جذابیت و شاخص‌های مالی بررسی کن.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-app bg-surface px-4 py-3">
              <p className="text-xs text-muted">تعداد نتایج</p>
              <p
                className="mt-1 text-lg font-bold tabular-nums"
                aria-live="polite"
              >
                {loading ? "…" : formatNumber(filteredItems.length)}
              </p>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl border border-app bg-surface px-4 py-3 text-sm font-semibold transition hover:border-brand-500/50 hover:text-brand-600 dark:hover:text-brand-400"
              >
                پاک‌کردن فیلترها
              </button>
            )}
          </div>
        </section>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v6m0 4h.01" />
                </svg>
              </span>

              <div>
                <h2 className="font-bold">دریافت اطلاعات ناموفق بود</h2>
                <p className="mt-1 wrap-break-word text-sm leading-6 text-muted">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="shrink-0 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "در حال دریافت..." : "تلاش مجدد"}
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && items.length === 0 && (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="در حال بارگذاری نمادها"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="min-h-64 animate-pulse rounded-2xl border border-app bg-surface p-5"
              >
                <div className="mb-5 h-5 w-24 rounded-lg bg-surface-2" />
                <div className="mb-3 h-4 w-3/4 rounded-lg bg-surface-2" />
                <div className="mb-8 h-3 w-1/2 rounded-lg bg-surface-2" />
                <div className="mb-4 h-3 w-full rounded-lg bg-surface-2" />
                <div className="h-10 rounded-xl bg-surface-2" />
              </div>
            ))}
          </div>
        )}

        {/* Stock cards */}
        {!loading || items.length > 0 ? (
          filteredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                  />
                ))}
              </div>

              <div
                ref={loadMoreRef}
                className="flex min-h-20 items-center justify-center py-6"
              >
                {visibleCount < filteredItems.length && (
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-600" />
                    در حال بارگذاری نمادهای بیشتر...
                  </div>
                )}

                {visibleCount >= filteredItems.length &&
                  filteredItems.length > PAGE_SIZE && (
                    <p className="text-xs text-muted">
                      همه {formatNumber(filteredItems.length)} نماد نمایش داده شدند.
                    </p>
                  )}
              </div>
            </>
          ) : (
            !loading && (
              <div className="rounded-3xl border border-dashed border-app bg-surface px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-muted">
                  <svg
                    aria-hidden="true"
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4M8 11h6" />
                  </svg>
                </div>

                <h2 className="mt-5 text-lg font-bold">
                  نمادی پیدا نشد
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                  عبارت جستجو یا صنعت انتخاب‌شده را تغییر بده تا نتایج بیشتری ببینی.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    نمایش همه نمادها
                  </button>
                )}
              </div>
            )
          )
        ) : null}

        {/* Sales trends */}
        <section className="mt-12 border-t border-app pt-10">
          <SalesTrends />
        </section>

        {/* Data timestamp */}
        {meta?.generatedAt && (
          <p className="mt-8 text-center text-xs text-muted">
            آخرین به‌روزرسانی:{" "}
            {new Date(meta.generatedAt).toLocaleString("fa-IR")}
          </p>
        )}
      </div>
    </main>
  );
}
