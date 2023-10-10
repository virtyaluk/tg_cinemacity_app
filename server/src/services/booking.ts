/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import { DateTime, Duration } from 'luxon';
import { v4 } from 'uuid';
import db from './db.js';
import { getMovieDetails } from './tmdb.js';
import {
    CinemaHallSchema,
    CinemaHallSeatType,
    TicketPrice,
    TicketPrices,
    MovieShowTimeSlot,
    TakenSeat,
    Ticket,
} from '../models/services/booking.js';
import { Invoice, BookingData } from '../models/services/db.js';

type ShowId = `${ number }_${ number }_${ number }_${ number }_${ number }`;

const BASE_IMG_URL: string = 'https://image.tmdb.org/t/p/w300';
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

const generateShowId = (selectedDate: number, selectedTime: MovieShowTimeSlot): ShowId => {
    const dt: Date = new Date(selectedDate);

    return `${ dt.getUTCDate() }_${ dt.getUTCMonth() }_${ dt.getUTCFullYear() }_${ selectedTime.hour }_${ selectedTime.minute }`;
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

export const getTakenSeats = async (showId: string): Promise<TakenSeat[]> =>
    db.chain.get('taken_seats').filter({ show_id: showId }).value();

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

export const getMyTickets = async (ownerId: number): Promise<Ticket[]> =>
    db.chain.get('tickets').filter({ owner_id: ownerId }).value();

export const createInvoice = async (ownerId: number, movieId: number, date: number, time: MovieShowTimeSlot, seats: TakenSeat[], lang: string = 'en-US') => {
    const invoiceId = v4(),
        movieDetails = await getMovieDetails(movieId, lang),
        hallSchema = await getHallSchema(),
        prices = await getTicketPrices(),
        description = `${ seats.length } seat${ seats.length > 1 && 's' || '' } for ${ time.hour }:${ time.minute.toString().padEnd(2, '0') }, ${ new Date(date).toLocaleDateString(lang, {
            month: 'short',
            day: '2-digit',
        }) }`,
        invoiceData: Invoice = {
            chat_id: ownerId,
            title: movieDetails.title,
            description,
            payload: invoiceId,
            currency: 'USD',
            prices: seats.map(({ row, seat }) => {
                const seatType = hallSchema.rows[row].seats[seat].type,
                    price = prices.prices[seatType];

                return {
                    label: `Seat ${ row }x${ seat }`,
                    amount: price,
                };
            }),
        },
        bookingData: BookingData = {
            invoice_id: invoiceId,
            owner_id: ownerId,
            movie_id: movieDetails.id,
            movie_title: movieDetails.title,
            movie_poster_path: movieDetails.poster_path,
            movie_runtime: movieDetails.runtime,
            date,
            time,
            seats,
        };

    // Telegram has troubles displaying images from TMDb.
    // if (movieDetails.poster_path) {
    //     invoice.photo_url = BASE_IMG_URL + movieDetails.poster_path;
    //     invoice.photo_width = 300;
    //     invoice.photo_height = 300;
    // }

    db.data.invoices.push(invoiceData);
    db.data.booking_data.push(bookingData);
    await db.write();

    return invoiceData;
};

export const confirmPayment = async (invoiceId: string): Promise<boolean> => {
    if (!invoiceId) {
        return false;
    }

    const bookingData: BookingData = db.chain.get('booking_data').find({ invoice_id: invoiceId }).value();

    if (!bookingData) {
        return false;
    }

    const showId: string = `${ bookingData.movie_id }_${ generateShowId(bookingData.date, bookingData.time) }`;

    bookingData.seats.forEach(({ row, seat }) => {
        db.data.taken_seats.push({
            row,
            seat,
            show_id: showId,
        });
    });

    db.data.tickets.push({
        owner_id: bookingData.owner_id,
        title: bookingData.movie_title,
        poster_path: bookingData.movie_poster_path,
        runtime: bookingData.movie_runtime,
        code: 'shtepan.com',
        seats: [{ row: 6, seat: 3 }, { row: 6, seat: 4 }, { row: 6, seat: 5 }],
        date: bookingData.date,
        time: bookingData.time,
    });

    await db.write();

    return true;
};
