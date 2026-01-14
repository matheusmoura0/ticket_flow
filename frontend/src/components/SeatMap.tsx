import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { Seat } from '../types';

interface SeatMapProps {
    eventId: number;
}

export function SeatMap({ eventId }: SeatMapProps) {
    const queryClient = useQueryClient();
    const [buyingSeatId, setBuyingSeatId] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { data: seats, isLoading } = useQuery<Seat[]>({
        queryKey: ['seats', eventId],
        queryFn: async () => {
            // Assuming backend has an endpoint to get seats for an event
            // If not, we might need to filter client side or add endpoint
            // Using existing /seats endpoint with query param if supported, or just /seats?event_id=...
            // Rails scaffold for seats supports index, but maybe not filtering by default without code.
            // I'll assume we need to add filtering to SeatsController or fetch all (inefficient but works for small demo).
            // Let's rely on adding filtering to backend later if needed, or just fetch all for now/
            // Wait, I didn't verify SeatsController filtering.
            // I'll fetch all and filter in frontend for MVP.
            const response = await api.get('/seats');
            return response.data.filter((s: Seat) => s.event_id === eventId);
        },
        enabled: !!eventId,
    });

    const buyTicketMutation = useMutation({
        mutationFn: async (seatId: number) => {
            const response = await api.post('/tickets', {
                ticket: {
                    seat_id: seatId,
                    user_email: 'demo@example.com', // Harcoded for demo
                },
            });
            return response.data;
        },
        onMutate: (seatId) => {
            setBuyingSeatId(seatId);
            setErrorMsg(null);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seats', eventId] });
            setBuyingSeatId(null);
        },
        onError: (error: any) => {
            setBuyingSeatId(null);
            const msg = error.response?.data?.error || 'Failed to buy ticket';
            setErrorMsg(msg);
            // Auto dismiss error after 5s
            setTimeout(() => setErrorMsg(null), 5000);
        },
    });

    if (isLoading) return <div>Loading seats...</div>;

    return (
        <div className="relative">
            {errorMsg && (
                <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50 animate-bounce">
                    {errorMsg}
                </div>
            )}

            <h2 className="text-xl font-bold mb-4">Select a Seat</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {seats?.map((seat) => (
                    <button
                        key={seat.id}
                        disabled={seat.status !== 'available' || buyingSeatId === seat.id}
                        onClick={() => buyTicketMutation.mutate(seat.id)}
                        className={`
              p-2 rounded text-sm font-medium transition-all
              ${seat.status === 'available'
                                ? 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300 border'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
              ${buyingSeatId === seat.id ? 'opacity-50 cursor-wait' : ''}
            `}
                        title={`$${seat.price}`}
                    >
                        {seat.name}
                        {seat.status === 'sold' && <span className="block text-xs">Sold</span>}
                        {seat.status === 'locked' && <span className="block text-xs">Locked</span>}
                    </button>
                ))}
            </div>
        </div>
    );
}
