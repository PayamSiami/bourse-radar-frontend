import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/lib/auth";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const baseUrl = "https://sahamkav.ir";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "بورس کاو — تحلیل بنیادی بورس تهران",
    template: "%s | بورس رادار",
  },
  description:
    "سیستم پیشرفته ارزیابی جذابیت سهام بورس تهران بر اساس فروش ماهانه، صورت‌های مالی و نسبت P/E آینده‌نگر. داده‌ها از کدال و TSETMC به‌روزرسانی می‌شوند.",
  keywords: [
    "بورس تهران",
    "تحلیل بنیادی",
    "سهام",
    "P/E",
    "P/E Forward",
    "ارزیابی سهام",
    "کدال",
    "TSETMC",
    "فروش ماهانه",
    "صورت‌های مالی",
    "حاشیه سود",
    "سود خالص",
    "تحلیل مالی",
    "بانک سرمایه",
    "سرمایه‌گذاری",
    "بورس",
    "سهام ممتاز",
    "شاخص کل",
    "شاخص هم وزن",
  ],
  authors: [{ name: "تیم بورس کاو", url: baseUrl }],
  creator: "بورس رادار",
  publisher: "بورس رادار",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: baseUrl,
    siteName: "بورس رادار",
    title: "بورس کاو — تحلیل بنیادی بورس تهران",
    description:
      "سیستم پیشرفته ارزیابی جذابیت سهام بورس تهران بر اساس فروش ماهانه، صورت‌های مالی و نسبت P/E آینده‌نگر.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "بورس کاو — تحلیل بنیادی بورس تهران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "بورس کاو — تحلیل بنیادی بورس تهران",
    description:
      "سیستم پیشرفته ارزیابی جذابیت سهام بورس تهران بر اساس فروش ماهانه، صورت‌های مالی و نسبت P/E آینده‌نگر.",
    creator: "@bours_radar",
    images: ["/twitter-image.jpg"],
  },
  appleWebApp: {
    title: "بورس رادار",
    statusBarStyle: "black-translucent",
    capable: true,
  },
  verification: {
    google: "ByFptW9EhQo_p46i1zOotDXpT1yLMOHaRwHkx_i7uyo",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light dark",
};

const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

// Comprehensive structured data for the application
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "بورس رادار",
  "alternateName": ["بورس کاو", "Bourse Radar", "شاهمکاو"],
  "description": "سیستم پیشرفته ارزیابی جذابیت سهام بورس تهران بر اساس فروش ماهانه، صورت‌های مالی و نسبت P/E آینده‌نگر.",
  "url": baseUrl,
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript.",
  "offers": {
    "@type": "FreeObserbation",
  },
  "maintainer": {
    "@type": "Organization",
    "name": "تیم بورس کاو",
    "url": baseUrl,
  },
  "featureList": [
    "تحلیل بنیادی سهام بر اساس فروش ماهانه",
    "محاسبه P/E Forward با حاشیه سود فصلی",
    "داده‌های به‌روزرسانی شده از کدال و TSETMC",
    "جدول‌بندی جذابیت سهام در دوره‌های مختلف",
    "سیستم ارزیابی پیشنهادی بر اساس دو دوره ۳ و ۱۲ ماهه",
    "نمایش حاشیه سود و نسبت‌های مالی",
    "مقایسه فروش جاری با دوره‌های مشابه سال قبل",
  ],
  "installReferrer": "",
  "inLanguage": "fa",
  "isFamilyFriendly": true,
  "keywords": "بورس تهران,تحلیل بنیادی,سهام,P/E,ارزیابی سهام,کدال",
};

// Add organization schema for better knowledge graph recognition
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "بورس رادار",
  "alternateName": ["بورس کاو", "Bourse Radar"],
  "url": baseUrl,
  "logo": `${baseUrl}/icon.svg`,
  "description": "سیستم پیشرفته ارزیابی جذابیت سهام بورس تهران بر اساس فروش ماهانه و صورت‌های مالی",
  "sameAs": [
    "https://twitter.com/bours_radar",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "",
    "contactType": "customer service",
    "availableLanguage": "Persian",
    "areaServed": "IR"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IR"
  }
};

// Add breadcrumb schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "خانه",
      "item": baseUrl
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-app text-fg">
        {/* Structured data scripts */}
        <Script
          id="structured-data-app"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <Script
          id="structured-data-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        <Script
          id="structured-data-breadcrumb"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* Theme initialization script */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />

        {/* Clarity script */}
        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "z22ikl4qu8");
            `,
          }}
        />

        <AuthProvider>
          <TopBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
