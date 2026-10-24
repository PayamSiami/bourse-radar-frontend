"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Ticket } from "@/lib/tickets/types";
import { fetchTickets } from "@/lib/tickets/api";
import { CreateTicketForm } from "@/components/tickets/CreateTicketForm";
import { TicketList } from "@/components/tickets/TicketList";

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const list = await fetchTickets();
            setTickets(list);
        } catch (err) {
            setError(err instanceof Error ? err.message : "خطای نامشخص");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <Card className="mb-8 overflow-hidden transition-all shadow-sm hover:shadow-lg">
                <div className="bg-linear-to-r from-brand-500/5 to-emerald-500/5 dark:from-brand-500/10 dark:to-emerald-500/10 px-6 py-4 border-b border-app">
                    <CardTitle className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 bg-linear-to-r from-brand-500 to-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[17px] font-bold text-fg">
                            تیکت‌های پشتیبانی من
                        </span>
                    </CardTitle>
                </div>

                <CardContent className="p-6">
                    <CreateTicketForm onCreated={loadTickets} onError={setError} />

                    {error && (
                        <div className="mb-5 p-3.5 bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-start gap-3">
                            <div className="flex-1">{error}</div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-600"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <TicketList tickets={tickets} loading={loading} />
                </CardContent>
            </Card>
        </div>
    );
}