import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { Seat } from '../types';

interface SeatMapProps {
    eventId: number;
}

export function SeatMap({ eventId }: SeatMapProps) {
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const queryClient = useQueryClient();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { data: seats, isLoading } = useQuery<Seat[]>({
        queryKey: ['seats', eventId],
        queryFn: async () => {
            const response = await api.get('/seats');
            return response.data.filter((s: Seat) => s.event_id === eventId);
        },
        enabled: !!eventId,
    });

    const buyTicketMutation = useMutation({
        mutationFn: async (seatId: number) => {
            await api.post('/tickets', {
                ticket: {
                    seat_id: seatId,
                    user_email: 'demo@example.com',
                },
            });
        },
    });

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        setErrorMsg(null);
        try {
            // Process all selected seats nicely
            await Promise.all(selectedSeatIds.map(id => buyTicketMutation.mutateAsync(id)));
            // Clear selection and refresh
            setSelectedSeatIds([]);
            queryClient.invalidateQueries({ queryKey: ['seats', eventId] });
            // Show success message or toast? For now just reset
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Failed to buy one or more tickets';
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(null), 5000);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const toggleSeat = (seatId: number) => {
        setSelectedSeatIds(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    if (isLoading) return <div className="p-8 text-center text-zinc-500">Loading seats...</div>;

    // Group seats by row
    const rows = seats?.reduce((acc, seat) => {
        const row = seat.name.charAt(0); // A, B, C...
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
    }, {} as Record<string, Seat[]>) || {};

    const sortedRowKeys = Object.keys(rows).sort();

    // Calculate total
    const totalAmount = selectedSeatIds.reduce((sum, id) => {
        const seat = seats?.find(s => s.id === id);
        return sum + (seat ? Number(seat.price) : 0);
    }, 0);

    return (
        <div className="relative pb-24">
            {errorMsg && (
                <div className="fixed top-24 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce font-medium">
                    {errorMsg}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900">Select Your Seats</h2>
                    <div className="flex gap-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-emerald-100 border border-emerald-400"></div>
                            <span className="text-zinc-600">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-zinc-100 border border-zinc-200"></div>
                            <span className="text-zinc-400">Sold</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-indigo-600 border border-indigo-600"></div>
                            <span className="text-zinc-900">Selected</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 items-center overflow-x-auto pb-4">
                    {/* Stage visual */}
                    <div className="w-2/3 h-12 bg-zinc-100 rounded-b-[4rem] mb-8 shadow-inner flex items-center justify-center text-zinc-400 text-sm font-medium tracking-widest uppercase">
                        Stage
                    </div>

                    {sortedRowKeys.map(rowLabel => (
                        <div key={rowLabel} className="flex gap-3 items-center">
                            <span className="w-6 text-zinc-400 font-medium text-sm text-center">{rowLabel}</span>
                            <div className="flex gap-2">
                                {rows[rowLabel].sort((a, b) => {
                                    // Extract number part for correct sorting (A1, A2... A10)
                                    const numA = parseInt(a.name.slice(1));
                                    const numB = parseInt(b.name.slice(1));
                                    return numA - numB;
                                }).map(seat => {
                                    const isSelected = selectedSeatIds.includes(seat.id);
                                    const isSold = seat.status === 'sold';
                                    const isAvailable = seat.status === 'available';

                                    return (
                                        <button
                                            key={seat.id}
                                            disabled={!isAvailable}
                                            onClick={() => toggleSeat(seat.id)}
                                            className={`
                                                w-10 h-10 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center
                                                ${isSold ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed border border-zinc-200' : ''}
                                                ${isAvailable && !isSelected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 hover:shadow-sm' : ''}
                                                ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-200 ring-offset-1 transform scale-105' : ''}
                                            `}
                                            title={`${seat.name} - $${seat.price}`}
                                        >
                                            {seat.name.substring(1)}
                                        </button>
                                    );
                                })}
                            </div>
                            <span className="w-6 text-zinc-400 font-medium text-sm text-center">{rowLabel}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Floating Bar */}
            {selectedSeatIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-zinc-200 shadow-2xl rounded-2xl p-4 w-[90%] max-w-md flex items-center justify-between z-40 animate-in slide-in-from-bottom-6 fade-in duration-300">
                    <div>
                        <div className="text-sm text-zinc-500 font-medium">{selectedSeatIds.length} Seats Selected</div>
                        <div className="text-2xl font-bold text-zinc-900">${totalAmount.toLocaleString()}</div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isCheckingOut ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Checkout'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
