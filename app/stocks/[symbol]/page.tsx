import StockDetailView from "@/components/StockDetailView";
import { fetchStockDetail } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface StockPageProps {
    params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
    const { symbol } = await params;
    let stock;

    try {
        stock = await fetchStockDetail(decodeURIComponent(symbol));
    } catch {
        return {
            title: "نماد یافت نشد",
        };
    }

    const faNumber = (num: number | null | undefined): string => {
        if (num == null) return "—";
        return String(num).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]!);
    };

    const stockData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": stock.name,
        "symbol": symbol,
        "stockExchange": {"@type": "StockExchange", "name": "Tehran Stock Exchange"},
        "parentOrganization": {
            "@type": "FinancialService",
            "name": "Tehran Stock Exchange",
            "url": "https://www.seo.ir",
        },
        "numberOfEmployees": {
            "@type": "EmployeeRoles",
            "employeeCount": 0,
            "roleManager": null,
            "employmentType": "notApplicable",
            "reason": "Not available",
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "telephone": null,
            "areaServed": "IR",
            "availableLanguage": "fa",
        },
    };

    return {
        title: `${symbol} — ${stock.name} | بورس رادار`,
        description:
            `تحلیل بنیادی ${stock.name} (${symbol}). قیمت فعلی: ${faNumber(stock.price.last)} ریال. P/E آینده نگر: ${Number(stock.forwardPe?.forwardPe).toFixed(2)}. ` +
            `ارزیابی جذابیت بر اساس فروش ماهانه، صورت‌های مالی و نسبت‌های مالی.`,
        openGraph: {
            title: `${symbol} — ${stock.name} | بورس رادار`,
            description:
                `تحلیل بنیادی ${stock.name} (${symbol}). قیمت: ${faNumber(stock.price.last)} ریال. P/E: ${Number(stock.forwardPe?.forwardPe).toFixed(2)}`,
            type: "article",
            url: `https://https://sahamkav.ir/stocks/${symbol}`,
            images: [
                {
                    url: `/api/og/stocks/${symbol}`,
                    width: 1200,
                    height: 630,
                    alt: `${stock.name} - تحلیل بنیادی`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${symbol} — ${stock.name} | بورس رادار`,
            description:
                `تحلیل ${stock.name} در بورس رادار. قیمت: ${faNumber(stock.price.last)} ریال.`,
            images: [`/api/og/stocks/${symbol}`],
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `https://https://sahamkav.ir/stocks/${symbol}`,
        },
    };
}

export default async function StockPage({ params }: StockPageProps) {
    const { symbol } = await params;

    let stock;
    try {
        stock = await fetchStockDetail(decodeURIComponent(symbol));
    } catch {
        notFound();
    }

    return <StockDetailView stock={stock} />;
}