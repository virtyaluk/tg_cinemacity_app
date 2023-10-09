/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import JSONdb from 'simple-json-db';
import { DateTime, Duration } from 'luxon';
import { getMovieDetails } from './tmdb.js';

import {
    CinemaHallSchema,
    CinemaHallSeatType,
    TicketPrice,
    TicketPrices,
    MovieShowTimeSlot,
    ShowTakenSeats,
    TakenSeat,
    Ticket,
} from '../models/services/booking.js';

const db = new JSONdb('../storage.json');

const TAKEN_SEATS_DB_KEY_PREFIX: string = 'taken_seats_';
const REGULAR_HALL_NUM_ROWS: number = 6;
const REGULAR_HALL_NUM_VIP_ROWS: number = 1;
const REGULAR_HALL_NUM_SEATS_PER_ROW: { [key: number]: number } = {
    0: 5,
    1: 6,
    2: 7,
    3: 8,
    4: 8,
    5: 8,
    6: 6,
};
const REGULAR_HALL_TICKET_PRICES: TicketPrice = {
    [CinemaHallSeatType.regular]: 500,
    [CinemaHallSeatType.vip]: 700,
};

export const getHallSchema = async (): Promise<CinemaHallSchema> => {
    return {
        rows: [
            ...[...new Array(REGULAR_HALL_NUM_ROWS)].map((_, rowId) => ({
                seats: [...new Array(REGULAR_HALL_NUM_SEATS_PER_ROW[rowId])].map((_, seatId) => ({
                    type: CinemaHallSeatType.regular,
                    row: rowId,
                    num: seatId,
                })),
            })),
            ...[...new Array(REGULAR_HALL_NUM_VIP_ROWS)].map((_, rowId) => ({
                seats: [...new Array(REGULAR_HALL_NUM_SEATS_PER_ROW[REGULAR_HALL_NUM_ROWS + rowId])].map((_, seatId) => ({
                    type: CinemaHallSeatType.vip,
                    row: REGULAR_HALL_NUM_ROWS + rowId,
                    num: seatId,
                })),
            })),
        ],
    };
};

export const getTicketPrices = async (): Promise<TicketPrices> => {
    return {
        prices: REGULAR_HALL_TICKET_PRICES,
    };
};

export const getTakenSeats = async (showId: string): Promise<TakenSeat[]> => {
    if (db.has(TAKEN_SEATS_DB_KEY_PREFIX + showId)) {
        const takenSeats = db.get(TAKEN_SEATS_DB_KEY_PREFIX + showId) as ShowTakenSeats;

        return takenSeats.taken_seats;
    }

    return [];
};

export const getShowTimeSlots = async (movieId: number): Promise<MovieShowTimeSlot[]> => {
    const { runtime } = await getMovieDetails(movieId),
        busyTime = Math.ceil(runtime / 15) * 15 + 15,
        dur = Duration.fromObject({ minutes: busyTime });
    let dt = DateTime.local(2023, 5, 5, 9, 0),
        dtDay = dt.day;
    let slots: MovieShowTimeSlot[] = [];

    do {
        slots.push({
            hour: dt.hour,
            minute: dt.minute,
        });

        dt = dt.plus(dur);
    } while (dt.day == dtDay);

    return slots;
};

export const getMyTickets = async (): Promise<Ticket[]> => {
    return [{
        owner_id: 'sfsdfasdfasd',
        title: 'Barbie',
        poster_path: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        runtime: 136,
        code: 'shtepan.com',
        seats: [{ row: 6, seat: 4 }],
        datetime: 1697090400,
    }, {
        owner_id: 'sfsdfasdfasd',
        title: 'Saw X',
        poster_path: '/aQPeznSu7XDTrrdCtT5eLiu52Yu.jpg',
        runtime: 90,
        code: 'shtepan.com',
        seats: [{ row: 6, seat: 4 }, { row: 6, seat: 5 }],
        datetime: 1696771800,
    }, {
        owner_id: 'sfsdfasdfasd',
        title: 'John Wick: Chapter 4',
        poster_path: '/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
        runtime: 118,
        code: 'shtepan.com',
        seats: [{ row: 6, seat: 3 }, { row: 6, seat: 4 }, { row: 6, seat: 5 }],
        datetime: 1698252300,
    }];
};
