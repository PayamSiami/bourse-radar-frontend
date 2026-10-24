import StockDetailView from "@/components/StockDetailView";
import { fetchStockDetail } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";

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

    const baseUrl = "https://sahamkav.ir";
    const stockData = {
        "@context": "https://schema.org",
        "@type": "Stock",
        "name": stock.name,
        "symbol": symbol,
        "stockExchange": {"@type": "StockExchange", "name": "Tehran Stock Exchange"},
        "price": stock.price.last,
        "currency": "IRR",
        "parentOrganization": {
            "@type": "FinancialService",
            "name": "Tehran Stock Exchange",
            "url": "https://www.seo.ir",
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "تحلیل بنیادی",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "قیمت سهام",
                    "url": `${baseUrl}/stocks/${symbol}`,
                    "price": stock.price.last,
                    "priceCurrency": "IRR"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "P/E Forward",
                    "url": `${baseUrl}/stocks/${symbol}`,
                    "price": stock.forwardPe?.forwardPe,
                    "priceCurrency": "IRR"
                }
            ]
        }
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
            url: `${baseUrl}/stocks/${symbol}`,
            images: [
                {
                    url: `${baseUrl}/api/og/stocks/${symbol}`,
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
            images: [`${baseUrl}/api/og/stocks/${symbol}`],
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${baseUrl}/stocks/${symbol}`,
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

    return (
        <>
            {/* Stock structured data */}
            <Script
                id="stock-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ 
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Stock",
                        "name": stock.name,
                        "symbol": symbol,
                        "stockExchange": {"@type": "StockExchange", "name": "Tehran Stock Exchange"},
                        "price": stock.price.last,
                        "currency": "IRR"
                    }) 
                }}
            />
            <StockDetailView stock={stock} />
        </>
    );
}
