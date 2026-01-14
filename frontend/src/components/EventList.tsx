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
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            <div className="grid gap-4">
                {events?.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => onSelectEvent(event.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedEventId === event.id
                            ? 'bg-blue-100 border-blue-500'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <h3 className="font-semibold">{event.name}</h3>
                        <p className="text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString()} - {event.location}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Seats: {event.total_seats}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
