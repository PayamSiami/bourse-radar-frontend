"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TicketConversation } from "@/components/tickets/TicketConversation";
import { sendMessage as sendMessageApi } from "@/lib/tickets/api";

export default function TicketDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const ticketId = Number(params.id);

    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            setSending(true);
            setError(null);
            await sendMessageApi(ticketId, text.trim());
            setText("");
            setRefreshKey((k) => k + 1); // force message list reload
        } catch (err) {
            setError(err instanceof Error ? err.message : "خطا در ارسال پیام");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <Card className="mb-8 overflow-hidden">
                <div className="bg-linear-to-r from-brand-500/5 to-emerald-500/5 px-6 py-4 border-b border-app">
                    <CardTitle className="text-[17px] font-bold text-fg">
                        مکالمه تیکت #{ticketId}
                    </CardTitle>
                </div>

                <CardContent className="p-6 space-y-3">
                    <button
                        onClick={() => router.push("/tickets")}
                        className="text-sm text-brand-600 hover:underline flex items-center gap-1"
                    >
                        ← بازگشت به لیست
                    </button>

                    {error && (
                        <div className="p-2 text-sm bg-red-50 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    <TicketConversation key={refreshKey} ticketId={ticketId} />

                    {/* Composer with send button */}
                    <div className="flex gap-2">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="پاسخ خود را بنویسید..."
                            maxLength={5000}
                            rows={2}
                            className="flex-1 px-3 py-2 bg-surface border border-app rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-400/40 resize-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={sending || !text.trim()}
                            className="px-4 bg-brand-500 hover:bg-brand-600 rounded-lg text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {sending ? "..." : "ارسال"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}