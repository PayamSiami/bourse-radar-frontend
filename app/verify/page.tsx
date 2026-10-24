"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<{ type: "loading" | "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus({ type: "error", message: "لینک تأیید معتبر نیست" });
      return;
    }

    const verify = async () => {
      setStatus({ type: "loading", message: "در حال تأیید ایمیل..." });
      try {
        await verifyEmail(token);
        setStatus({ type: "success", message: "ایمیل شما با موفقیت تأیید شد!" });
        router.push("/profile");
      } catch (error) {
        setStatus({ type: "error", message: error instanceof Error ? error.message : "خطا در تأیید ایمیل" });
      }
    };

    verify();
  }, [searchParams, verifyEmail, router]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-app flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-app rounded-2xl p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-fg mb-4">تأییم ایمیل</h1>
        
        {status?.type === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
            <p className="text-muted">{status.message}</p>
          </div>
        )}

        {status?.type === "success" && (
          <div className="py-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-fg mb-2">{status.message}</h2>
            <p className="text-muted mb-6">هم اکنون به صفحه پروفایل خود هدایت می‌شوید</p>
            <Button onClick={() => router.push("/profile")} className="w-full">
              رفتن به پروفایل
            </Button>
          </div>
        )}

        {status?.type === "error" && (
          <div className="py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-fg mb-2">❌ {status.message}</h2>
            <Button onClick={() => router.push("/register")} className="w-full">
              صفحه ثبت‌نام
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
