"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    fetchSalesTrends,
    type SalesTrendItem,
} from "@/lib/api";
import { faPercent } from "@/lib/format";

type Metric = "mom" | "cumulative";
type Mode = "gain" | "loss";

type TrendCardProps = {
    title: string;
    description: string;
    items: SalesTrendItem[];
    mode: Mode;
    metric: Metric;
    loading?: boolean;
};

type TrendData = Awaited<ReturnType<typeof fetchSalesTrends>>;

const faInt = new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 0,
});

const tone = {
    gain: {
        text: "text-emerald-600 dark:text-emerald-400",
        icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        bar: "bg-emerald-500",
        badge:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    },
    loss: {
        text: "text-red-600 dark:text-red-400",
        icon: "bg-red-500/10 text-red-600 dark:text-red-400",
        bar: "bg-red-500",
        badge:
            "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
    },
} as const;

function getPercentage(item: SalesTrendItem, metric: Metric): number | null {
    const raw =
        metric === "cumulative"
            ? item.growth_percent
            : item.change_percent;

    if (raw === null || raw === undefined || raw === "") {
        return null;
    }

    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
}

function getDateLabel(value?: string | null): string {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
    });
}

function TrendIcon({ mode }: { mode: Mode }) {
    return mode === "gain" ? (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
        </svg>
    ) : (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m7 7 10 10" />
            <path d="M17 8v9H8" />
        </svg>
    );
}

function TrendSkeleton() {
    return (
        <div className="space-y-2.5" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="flex h-[58px] items-center gap-3 rounded-xl border border-app/60 px-3"
                >
                    <div className="h-7 w-7 animate-pulse rounded-lg bg-surface-2" />

                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
                        <div className="h-2.5 w-28 max-w-full animate-pulse rounded bg-surface-2" />
                    </div>

                    <div className="h-4 w-14 animate-pulse rounded bg-surface-2" />
                </div>
            ))}
        </div>
    );
}

function TrendRow({
    item,
    rank,
    mode,
    metric,
}: {
    item: SalesTrendItem;
    rank: number;
    mode: Mode;
    metric: Metric;
}) {
    const colors = tone[mode];
    const percentage = getPercentage(item, metric);
    const dateLabel = getDateLabel(item.month_end);

    return (
        <li>
            <Link
                href={`/stocks/${encodeURIComponent(item.symbol)}`}
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-transparent px-2.5 py-3 transition-colors hover:border-app hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums ${rank <= 3
                            ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                            : "bg-surface-2 text-muted"
                        }`}
                >
                    {faInt.format(rank)}
                </span>

                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-fg transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400">
                        {item.symbol}
                    </p>

                    <p className="mt-1 truncate text-[11px] text-muted">
                        {item.name}
                    </p>
                </div>

                <div className="shrink-0 text-left">
                    <span
                        className={`inline-flex items-center gap-1 text-sm font-bold tabular-nums ${colors.text}`}
                    >
                        <span aria-hidden="true">
                            {mode === "gain" ? "▲" : "▼"}
                        </span>

                        {percentage === null
                            ? "—"
                            : faPercent(Math.abs(percentage))}
                    </span>

                    {dateLabel && (
                        <p className="mt-1 text-[10px] text-muted">
                            {dateLabel}
                        </p>
                    )}
                </div>
            </Link>
        </li>
    );
}

function TrendCard({
    title,
    description,
    items,
    mode,
    metric,
    loading,
}: TrendCardProps) {
    const colors = tone[mode];

    return (
        <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-app bg-surface shadow-sm transition-shadow duration-300 hover:shadow-lg">
            <div
                className={`h-1 w-full ${colors.bar}`}
                aria-hidden="true"
            />

            <div className="flex items-start gap-3 p-5 pb-4">
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${colors.icon}`}
                >
                    <TrendIcon mode={mode} />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold leading-6 text-fg">
                        {title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted">
                        {description}
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${colors.badge}`}
                >
                    {mode === "gain" ? "رشد" : "افت"}
                </span>
            </div>

            <div className="mx-5 border-t border-app" />

            <div className="flex-1 px-3 py-3 sm:px-4">
                {loading ? (
                    <TrendSkeleton />
                ) : items.length === 0 ? (
                    <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 text-muted">
                            <svg
                                aria-hidden="true"
                                className="h-6 w-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            >
                                <path d="M4 5h16v14H4z" />
                                <path d="M8 10h8M8 14h5" />
                            </svg>
                        </div>

                        <p className="mt-4 text-sm font-semibold text-fg">
                            داده‌ای موجود نیست
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted">
                            در حال حاضر اطلاعاتی برای این دسته ثبت نشده است.
                        </p>
                    </div>
                ) : (
                    <ol className="space-y-1">
                        {items.map((item, index) => (
                            <TrendRow
                                key={`${item.symbol}-${item.month_end ?? index}`}
                                item={item}
                                rank={index + 1}
                                mode={mode}
                                metric={metric}
                            />
                        ))}
                    </ol>
                )}
            </div>

            <div className="mt-auto border-t border-app px-5 py-4">
                <Link
                    href="/stocks"
                    className="flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-muted transition hover:bg-surface-2 hover:text-brand-600 dark:hover:text-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                    مشاهده همه نمادها

                    <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </Link>
            </div>
        </article>
    );
}

export function SalesTrends() {
    const [data, setData] = useState<TrendData | null>(null);
    const [loading, setLoading] = useState(true);

    const requestId = useRef(0);

    const load = useCallback(async () => {
        const id = ++requestId.current;

        setLoading(true);

        try {
            const result = await fetchSalesTrends();

            if (id !== requestId.current) return;

            setData(result);
        } catch (_err: unknown) {
            if (id !== requestId.current) return;

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

    return (
        <section
            aria-labelledby="sales-trends-heading"
            className="space-y-6"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-xs font-semibold tracking-wide text-brand-600 dark:text-brand-400">
                        بررسی عملکرد شرکت‌ها
                    </p>

                    <h2
                        id="sales-trends-heading"
                        className="text-2xl font-extrabold tracking-tight text-fg sm:text-3xl"
                    >
                        روند فروش شرکت‌ها
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                        نمادها را بر اساس رشد فروش ماهانه، افت فروش و رشد تجمعی مقایسه کن.
                    </p>
                </div>

                <Link
                    href="/stocks"
                    className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-app bg-surface px-4 py-2 text-xs font-semibold text-fg transition hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400 sm:self-auto"
                >
                    بررسی نمادها

                    <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
                <TrendCard
                    title="بیشترین رشد فروش ماهانه"
                    description="مقایسه تغییر فروش نسبت به ماه قبل"
                    items={data?.gainers ?? []}
                    mode="gain"
                    metric="mom"
                    loading={loading}
                />

                <TrendCard
                    title="بیشترین افت فروش ماهانه"
                    description="شناسایی شرکت‌های دارای کاهش فروش"
                    items={data?.losers ?? []}
                    mode="loss"
                    metric="mom"
                    loading={loading}
                />

                <TrendCard
                    title="بیشترین رشد فروش تجمعی"
                    description="بررسی رشد فروش در دوره تجمعی گزارش‌شده"
                    items={data?.cumulative ?? []}
                    mode="gain"
                    metric="cumulative"
                    loading={loading}
                />
            </div>
        </section>
    );
}

export default SalesTrends;
