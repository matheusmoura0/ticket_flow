import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import type { Event } from '../types';

interface EventListProps {
    onSelectEvent: (eventId: number) => void;
    selectedEventId: number | null;
}

export function EventList({ onSelectEvent, selectedEventId }: EventListProps) {
    const { data: events, isLoading, error } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: async () => {
            const response = await api.get('/events');
            return response.data;
        },
    });

    if (isLoading) return <div className="p-4">Loading events...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading events</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Upcoming Events</h2>
            <div className="space-y-4">
                {events?.map((event) => (
                    <div
                        key={event.id}
                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${selectedEventId === event.id
                            ? 'ring-2 ring-indigo-500 ring-offset-2'
                            : 'hover:shadow-xl'
                            }`}
                    >
                        {/* Card Background with Dark Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

                        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
                            {/* Artist Image Placeholder */}
                            <div className="w-full sm:w-48 h-48 sm:h-32 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shrink-0 shadow-lg flex items-center justify-center text-white/20">
                                <span className="sr-only">Event Image</span>
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 text-center sm:text-left space-y-2">
                                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                                    {event.name}
                                </h3>
                                <div className="space-y-1 text-slate-300">
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="flex flex-col items-center gap-3 min-w-[140px]">
                                <span className="text-sm font-medium text-slate-400">
                                    Seats: {event.total_seats}
                                </span>
                                <button
                                    onClick={() => onSelectEvent(event.id)}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                                >
                                    Buy Tickets
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
