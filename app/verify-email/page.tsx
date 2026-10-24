"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Mail,
    ShieldCheck,
    ShieldAlert,
    LoaderCircle,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    RotateCcw,
    Send,
} from "lucide-react";

import { useAuth } from "@/lib/auth";
import { Button, Card, CardContent } from "@/components/ui/card";

const API = process.env.NEXT_PUBLIC_API_URL;
const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export default function VerifyEmailPage() {
    const router = useRouter();
    const { user, updateUser } = useAuth();

    const [digits, setDigits] = useState<string[]>(
        Array(CODE_LENGTH).fill("")
    );
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [alreadyVerified, setAlreadyVerified] = useState(false);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // Detect already-verified users
    useEffect(() => {
        if (user?.verified) {
            setAlreadyVerified(true);
        }
    }, [user]);

    // Resend cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => {
            setCooldown((c) => (c <= 1 ? 0 : c - 1));
        }, 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    // Focus first empty input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const code = digits.join("");

    const setDigit = useCallback(
        (index: number, value: string) => {
            const clean = value.replace(/\D/g, "").slice(-1);
            setDigits((prev) => {
                const next = [...prev];
                next[index] = clean;
                return next;
            });
            setError(null);
            setSuccess(null);

            if (clean && index < CODE_LENGTH - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        },
        []
    );

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace") {
            if (digits[index]) {
                setDigits((prev) => {
                    const next = [...prev];
                    next[index] = "";
                    return next;
                });
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
            e.preventDefault();
            return;
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
            e.preventDefault();
        }

        if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
            e.preventDefault();
        }
    };

    // Handle paste of a full code
    const handlePaste = (
        index: number,
        e: React.ClipboardEvent<HTMLInputElement>
    ) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!pasted) return;
        e.preventDefault();

        const chars = pasted.slice(0, CODE_LENGTH - index).split("");
        setDigits((prev) => {
            const next = [...prev];
            chars.forEach((c, i) => {
                next[index + i] = c;
            });
            return next;
        });

        const lastFilled = Math.min(index + chars.length, CODE_LENGTH - 1);
        inputRefs.current[lastFilled]?.focus();
    };

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (verifying) return;

        if (code.length !== CODE_LENGTH) {
            setError("لطفاً کد ۶ رقمی را کامل وارد کنید.");
            return;
        }

        setVerifying(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${API}/auth/verify-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(user?.token
                        ? { Authorization: `Bearer ${user.token}` }
                        : {}),
                },
                body: JSON.stringify({ code }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                throw new Error(
                    data.error?.[0]?.message ??
                    data.error ??
                    data.message ??
                    "کد وارد شده معتبر نیست."
                );
            }

            // Update auth context + storage
            if (user) {
                const updated = { ...user, verified: true };
                try {
                    localStorage.setItem("user", JSON.stringify(updated));
                } catch {
                    /* ignore */
                }
                updateUser(updated);
            }

            setSuccess("ایمیل شما با موفقیت تأیید شد.");
            setAlreadyVerified(true);

            setTimeout(() => {
                router.push("/profile");
            }, 1200);
        } catch (err) {
            console.error("Verify email failed:", err);
            setError(
                err instanceof Error ? err.message : "خطا در تأیید ایمیل."
            );
            setDigits(Array(CODE_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (resending || cooldown > 0) return;

        setResending(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${API}/auth/resend-verification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(user?.token
                        ? { Authorization: `Bearer ${user.token}` }
                        : {}),
                },
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                throw new Error(
                    data.error?.[0]?.message ??
                    data.error ??
                    data.message ??
                    "ارسال کد انجام نشد."
                );
            }

            setSuccess("کد تأیید جدید به ایمیل شما ارسال شد.");
            setCooldown(RESEND_COOLDOWN);
        } catch (err) {
            console.error("Resend failed:", err);
            setError(
                err instanceof Error ? err.message : "ارسال کد انجام نشد."
            );
        } finally {
            setResending(false);
        }
    };

    // ── Already verified state ──
    if (alreadyVerified) {
        return (
            <main
                dir="rtl"
                className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-app px-4 py-10"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
                />
                <Card className="relative w-full max-w-md overflow-hidden rounded-3xl border border-app bg-surface shadow-sm">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                            <ShieldCheck size={32} className="text-emerald-500" />
                        </div>
                        <h1 className="text-xl font-extrabold text-fg">
                            ایمیل شما تأیید شده است
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-muted">
                            {user?.email
                                ? `آدرس ${user.email} قبلاً با موفقیت تأیید شده است.`
                                : "حساب کاربری شما به‌طور کامل فعال است."}
                        </p>
                        <Button
                            onClick={() => router.push("/profile")}
                            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
                        >
                            رفتن به پروفایل
                            <ArrowRight size={16} />
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main
            dir="rtl"
            className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-app px-4 py-8 sm:px-6 lg:py-12"
        >
            {/* Decorative background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl"
            />

            <div className="relative mx-auto flex max-w-md flex-col">
                {/* Back link */}
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 self-start rounded-lg text-sm text-muted transition hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                    <ArrowRight size={16} />
                    بازگشت
                </button>

                <Card className="overflow-hidden rounded-3xl border border-app bg-surface shadow-sm">
                    <CardContent className="p-6 sm:p-8">
                        {/* Icon */}
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10">
                            <Mail size={26} className="text-brand-500" />
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-fg">
                            تأیید ایمیل
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-muted">
                            کد ۶ رقمی ارسال‌شده به{" "}
                            {user?.email ? (
                                <span dir="ltr" className="font-semibold text-fg">
                                    {user.email}
                                </span>
                            ) : (
                                "ایمیل شما"
                            )}{" "}
                            را وارد کنید.
                        </p>

                        {/* Feedback */}
                        {error && (
                            <div
                                role="alert"
                                className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                            >
                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                <p className="leading-6">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div
                                role="status"
                                className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                            >
                                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                                <p className="leading-6">{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="mt-6">
                            {/* Code inputs */}
                            <div
                                dir="ltr"
                                className="flex justify-center gap-2 sm:gap-3"
                                aria-label="کد تأیید"
                            >
                                {digits.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => {
                                            inputRefs.current[i] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={1}
                                        value={digit}
                                        disabled={verifying}
                                        onChange={(e) => setDigit(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        onPaste={(e) => handlePaste(i, e)}
                                        aria-label={`رقم ${i + 1} کد تأیید`}
                                        className="h-14 w-11 rounded-xl border border-app bg-app text-center text-xl font-bold text-fg transition
                               focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/15
                               disabled:opacity-60 sm:h-16 sm:w-12"
                                    />
                                ))}
                            </div>

                            <Button
                                type="submit"
                                disabled={verifying || code.length !== CODE_LENGTH}
                                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {verifying ? (
                                    <>
                                        <LoaderCircle size={18} className="animate-spin" />
                                        در حال تأیید...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={18} />
                                        تأیید ایمیل
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Resend */}
                        <div className="mt-6 border-t border-app pt-5 text-center">
                            <p className="text-xs text-muted">
                                کد را دریافت نکردید؟
                            </p>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending || cooldown > 0}
                                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-brand-400"
                            >
                                {resending ? (
                                    <>
                                        <LoaderCircle size={15} className="animate-spin" />
                                        در حال ارسال...
                                    </>
                                ) : cooldown > 0 ? (
                                    <>
                                        <RotateCcw size={15} />
                                        ارسال مجدد در {cooldown} ثانیه
                                    </>
                                ) : (
                                    <>
                                        <Send size={15} />
                                        ارسال مجدد کد
                                    </>
                                )}
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Helper */}
                <div className="mt-5 flex items-start justify-center gap-2 text-xs text-muted">
                    <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                    <span className="max-w-xs text-center leading-5">
                        اگر ایمیل را در صندوق ورودی نمی‌بینید، پوشه اسپم را بررسی کنید.
                    </span>
                </div>
            </div>
        </main>
    );
}