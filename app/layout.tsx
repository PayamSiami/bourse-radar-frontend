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
    default: "بورس کاو— تحلیل بنیادی بورس تهران",
    template: "%s | بورس رادار",
  },
  description:
    "سیستم پیشرفته ارزیابی جذابیت سهام بورس تهران بر اساس فروش ماهانه، صورت‌های مالی و نسبت P/E آینده‌نگر. داده‌ها از کدال و TSETMC به‌روزرسانی می‌شوند.",
  keywords: [
    "بورس تهران",
    "تحلیل بنیادی",
    "سهام",
    "P/E",
    "aranbari",
    "کدال",
    "TSETMC",
    "ارزیابی سهام",
    "سودآوری شرکت‌ها",
    "فروش ماهانه",
    "صورت‌های مالی",
    "نسبت‌های مالی",
    "تحلیل تکنیکال",
    "داده‌های بورس",
  ],
  authors: [{ name: "بورش کاوتیم", url: baseUrl }],
  creator: "بورش رادار",
  publisher: "بورش رادار",
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
    title: "بورس کاو— تحلیل بنیادی بورس تهران",
    description:
      "سیستم پیشرفته ارزیابی جذابیت سهام بورس تهران بر اساس فروش ماهانه، صورت‌های مالی و نسبت P/E آینده‌نگر.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "بورس کاو— تحلیل بنیادی بورس تهران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "بورس کاو— تحلیل بنیادی بورس تهران",
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

  // Google Search Console verification
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "بورس رادار",
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
    "name": "بورش کاوبازسازی",
    "url": baseUrl,
  },
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
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-app text-fg">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
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
        <TopBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
