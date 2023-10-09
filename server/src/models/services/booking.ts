export enum CinemaHallSeatType {
    regular = 0,
    vip = 1,
}

export interface CinemaHallSeatSchema {
    type: CinemaHallSeatType;
    row: number;
    num: number;
}

export interface CinemaHallRowSchema {
    seats: CinemaHallSeatSchema[];
}

export interface CinemaHallSchema {
    rows: CinemaHallRowSchema[];
}

export type TicketPrice = {
    [key in CinemaHallSeatType]: number;
};

export interface TicketPrices {
    prices: TicketPrice;
}

export interface MovieShowTimeSlot {
    hour: number;
    minute: number;
}

export interface TakenSeat {
    seat: number;
    row: number;
}

export interface ShowTakenSeats {
    taken_seats: TakenSeat[];
}

export interface Ticket {
    owner_id: string;
    runtime: number;
    title: string;
    datetime: number;
    code: string;
    poster_path: string;
    seats: TakenSeat[];
}
