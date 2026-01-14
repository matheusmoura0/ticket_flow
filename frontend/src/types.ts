export interface Event {
    id: number;
    name: string;
    date: string;
    location: string;
    total_seats: number;
}

export interface Seat {
    id: number;
    name: string;
    status: 'available' | 'sold' | 'locked';
    price: string;
    event_id: number;
}

export interface Ticket {
    id: number;
    user_email: string;
    seat_id: number;
    payment_reference: string;
    created_at: string;
}
