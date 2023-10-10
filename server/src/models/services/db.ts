import { MovieShowTimeSlot } from './booking';

export interface InvoicePrice {
    label: string;
    amount: number;
}

export interface Invoice {
    chat_id: number;
    title: string;
    description: string;
    payload: string;
    currency: 'USD';
    prices: InvoicePrice[];
    photo_url?: string;
    photo_width?: number;
    photo_height?: number;
}

export interface TakenSeat {
    show_id?: string;
    seat: number;
    row: number;
}

export interface BookingData {
    invoice_id: string;
    owner_id: number;
    movie_id: number;
    movie_title: string;
    movie_poster_path: string;
    movie_runtime: number;
    date: number;
    time: MovieShowTimeSlot;
    seats: TakenSeat[];
}
