"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { fetchRankings, RankingItem } from "@/lib/api";
import { num } from "@/lib/format";
import SearchBar, { SortKey } from "@/components/SearchBar";
import StockCard from "@/components/StockCard";
import StockSkeleton from "@/components/StockSkeleton";

function faNum(n: number | string | null | undefined): string {
    if (n === null || n === undefined) return "—";
    return Number(n).toLocaleString("fa-IR");
}

function StocksPageInner() {
    const searchParams = useSearchParams();
    const sectorFromUrl = searchParams.get("sector");

    const [items, setItems] = useState<RankingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sort, setSort] = useState<SortKey>("rank");
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        fetchRankings(200)
            .then((res) => setItems(res.data))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setDebouncedQuery(query);
    }, [query]);

    const filtered = useMemo(() => {
        let list = items;
        if (sectorFromUrl) {
            list = list.filter((s) => s.sector === sectorFromUrl);
        }
        const dq = debouncedQuery.trim();
        if (dq) {
            list = list.filter(
                (s) => s.symbol.includes(dq) || s.name.includes(dq)
            );
        }
        return list;
    }, [items, debouncedQuery, sectorFromUrl]);

    const sorted = useMemo(() => {
        const copy = [...filtered];
        const by =
            (fn: (s: RankingItem) => number | null, dir: 1 | -1 = 1) =>
                (a: RankingItem, b: RankingItem) => {
                    const av = fn(a);
                    const bv = fn(b);
                    if (av === null && bv === null) return 0;
                    if (av === null) return 1;
                    if (bv === null) return -1;
                    return (av - bv) * dir;
                };

        switch (sort) {
            case "score":
                return copy.sort(by((s) => num(s.attractivenessScore), -1));
            case "pe":
                return copy.sort(by((s) => num(s.forwardPe), 1));
            case "change":
                return copy.sort(by((s) => num(s.priceChangePercent), -1));
            case "volume":
                return copy.sort(by((s) => num(s.dailyVolume), -1));
            default:
                return copy.sort(by((s) => num(s.rank), 1));
        }
    }, [filtered, sort]);

    // ── Dashboard metrics & chart data ──────────────────────────────
    const stats = useMemo(() => {
        if (!sorted.length) return null;
        const scores = sorted
            .map((s) => num(s.attractivenessScore))
            .filter((v): v is number => v !== null);
        const changes = sorted
            .map((s) => num(s.priceChangePercent))
            .filter((v): v is number => v !== null);

        const avgScore =
            scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : null;
        const avgChange =
            changes.length > 0
                ? changes.reduce((a, b) => a + b, 0) / changes.length
                : null;
        const positive = changes.filter((c) => c > 0).length;
        const negative = changes.filter((c) => c < 0).length;

        return {
            count: sorted.length,
            avgScore,
            avgChange,
            positive,
            negative,
        };
    }, [sorted]);

    const chartData = useMemo(() => {
        // Top 12 by attractiveness for the bar chart
        return [...sorted]
            .sort(
                (a, b) =>
                    (num(b.attractivenessScore) ?? 0) -
                    (num(a.attractivenessScore) ?? 0)
            )
            .slice(0, 12)
            .map((s) => ({
                symbol: s.symbol,
                score: num(s.attractivenessScore) ?? 0,
                change: num(s.priceChangePercent) ?? 0,
            }));
    }, [sorted]);

    return (
        <main className="flex-1 bg-app">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* ── Header ─────────────────────────────────────────── */}
                <div className="mb-6">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-fg tracking-tight">
                            {sectorFromUrl ? sectorFromUrl : "همه سهام"}
                        </h1>
                        {sectorFromUrl && (
                            <Link
                                href="/stocks"
                                className="text-[11px] text-muted hover:text-fg transition px-2.5 py-1 rounded-lg hover:bg-surface-2 border border-transparent hover:border-border"
                            >
                                ✕ پاک کردن فیلتر
                            </Link>
                        )}
                    </div>
                    <p className="text-xs text-muted">
                        {loading
                            ? "در حال بارگذاری..."
                            : `${faNum(sorted.length)} نماد` +
                            (sectorFromUrl ? ` در گروه ${sectorFromUrl}` : "")}
                    </p>
                </div>

                {/* ── Stats + Chart ──────────────────────────────────── */}
                {!loading && !error && stats && (
                    <div className="mb-6 grid grid-cols-1 lg:grid-cols-5 gap-4">
                        {/* KPI cards */}
                        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
                            <StatCard
                                label="میانگین امتیاز"
                                value={
                                    stats.avgScore !== null
                                        ? faNum(stats.avgScore.toFixed(1))
                                        : "—"
                                }
                                accent="brand"
                            />
                            <StatCard
                                label="میانگین تغییر"
                                value={
                                    stats.avgChange !== null
                                        ? `${stats.avgChange >= 0 ? "+" : ""}${faNum(
                                            stats.avgChange.toFixed(2)
                                        )}٪`
                                        : "—"
                                }
                                accent={
                                    stats.avgChange !== null && stats.avgChange >= 0
                                        ? "green"
                                        : "red"
                                }
                            />
                            <StatCard
                                label="مثبت امروز"
                                value={faNum(stats.positive)}
                                accent="green"
                            />
                            <StatCard
                                label="منفی امروز"
                                value={faNum(stats.negative)}
                                accent="red"
                            />
                        </div>

                        {/* Attractiveness bar chart */}
                        <div className="lg:col-span-3 rounded-2xl border border-border bg-surface p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-fg">
                                    امتیاز جذابیت — ۱۲ نماد برتر
                                </h3>
                                <span className="text-[10px] text-muted">
                                    مرتب‌شده بر اساس امتیاز
                                </span>
                            </div>
                            <div className="h-44">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
                                    >
                                        <XAxis
                                            dataKey="symbol"
                                            tick={{ fontSize: 10, fill: "var(--muted)" }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 10, fill: "var(--muted)" }}
                                            axisLine={false}
                                            tickLine={false}
                                            width={32}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: "var(--surface-2)",
                                                border: "1px solid var(--border)",
                                                borderRadius: 12,
                                                fontSize: 12,
                                            }}
                                            formatter={(value, name, item, index, payload) => [
                                                value !== undefined ? faNum(Number(value).toFixed(1)) : faNum(0),
                                                "امتیاز",
                                            ] as readonly string[]}
                                            labelFormatter={(label) => `نماد: ${label}`}
                                        />
                                        <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={28}>
                                            {chartData.map((entry, i) => (
                                                <Cell
                                                    key={entry.symbol}
                                                    fill={
                                                        entry.change >= 0
                                                            ? "var(--brand-500, #3b82f6)"
                                                            : "var(--red-500, #ef4444)"
                                                    }
                                                    fillOpacity={0.85 - i * 0.04}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Search + Sort ──────────────────────────────────── */}
                <div className="mb-5">
                    <SearchBar
                        onSearch={setQuery}
                        sort={sort}
                        onSort={setSort}
                        loading={loading}
                    />
                </div>

                {/* ── Error ──────────────────────────────────────────── */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm flex items-center gap-3">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <p className="font-medium">خطا در دریافت داده‌ها</p>
                            <p className="text-xs opacity-80 mt-0.5">{error}</p>
                        </div>
                    </div>
                )}

                {/* ── Grid ───────────────────────────────────────────── */}
                <WindowedGrid items={sorted} loading={loading} />

                {/* ── Empty state ────────────────────────────────────── */}
                {!loading && !error && sorted.length === 0 && (
                    <div className="text-center py-20 text-muted">
                        <div className="text-5xl mb-4 opacity-30">🔍</div>
                        <p className="text-sm font-medium">
                            {sectorFromUrl
                                ? "نمادی در این گروه یافت نشد"
                                : "نمادی یافت نشد"}
                        </p>
                        <p className="text-xs mt-1 opacity-70">
                            فیلتر یا عبارت جستجو را تغییر دهید
                        </p>
                        {sectorFromUrl && (
                            <Link
                                href="/stocks"
                                className="inline-block mt-5 text-xs text-brand-600 dark:text-brand-400 hover:opacity-80 underline underline-offset-2"
                            >
                                نمایش همه سهام
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

// ── Small KPI card ────────────────────────────────────────────────
function StatCard({
    label,
    value,
    accent = "brand",
}: {
    label: string;
    value: string;
    accent?: "brand" | "green" | "red";
}) {
    const accentClass = {
        brand: "text-brand-600 dark:text-brand-400",
        green: "text-emerald-600 dark:text-emerald-400",
        red: "text-red-600 dark:text-red-400",
    }[accent];

    return (
        <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col justify-between">
            <p className="text-[11px] text-muted mb-1">{label}</p>
            <p className={`text-xl font-bold tabular-nums ${accentClass}`}>
                {value}
            </p>
        </div>
    );
}

export default function StocksPage() {
    return (
        <Suspense
            fallback={
                <main className="flex-1 bg-app">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                        <WindowedGrid items={[]} loading />
                    </div>
                </main>
            }
        >
            <StocksPageInner />
        </Suspense>
    );
}

// ──────────────────────────────────────────────────────────
// Progressive list — avoids mounting 200 StockCards at once
// ──────────────────────────────────────────────────────────
function WindowedGrid({
    items,
    loading,
}: {
    items: RankingItem[];
    loading: boolean;
}) {
    const STEP = 24;
    const [visible, setVisible] = useState(STEP);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setVisible(STEP);
    }, [items]);

    useEffect(() => {
        if (loading) return;
        const el = sentinelRef.current;
        if (!el) return;
        if (visible >= items.length) return;

        if (typeof IntersectionObserver === "undefined") {
            setVisible(items.length);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisible((n) => Math.min(n + STEP, items.length));
                }
            },
            { rootMargin: "600px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [items.length, loading, visible]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <StockSkeleton key={i} />
                ))}
            </div>
        );
    }

    const slice = items.slice(0, visible);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {slice.map((s) => (
                    <StockCard key={s.symbol} stock={s} />
                ))}
            </div>
            {visible < items.length && (
                <div
                    ref={sentinelRef}
                    className="mt-8 flex flex-col items-center gap-2"
                    aria-hidden="true"
                >
                    <div className="h-1 w-24 rounded-full bg-surface-2 overflow-hidden">
                        <div
                            className="h-full bg-brand-500/60 transition-all duration-300"
                            style={{ width: `${(visible / items.length) * 100}%` }}
                        />
                    </div>
                    <span className="text-[11px] text-muted tabular-nums">
                        {faNum(visible)} از {faNum(items.length)}
                    </span>
                </div>
            )}
        </>
    );
}