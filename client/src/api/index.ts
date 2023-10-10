/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import { SERVER_API_BASE_URL_PROD, SERVER_API_BASE_URL_DEV } from '../config';
import {
    ConfigResponse,
    MovieListResponse,
    MovieDetailsResponse,
    MovieCreditsResponse,
    MovieScheduleResponse,
    ShowTakenSeats,
    TicketsResponse,
    CreateInvoiceRequestBody,
    CreateInvoiceResponse,
} from '../../../shared';

let SERVER_API_BASE_URL = SERVER_API_BASE_URL_DEV;

if (import.meta.env.MODE == 'production') {
    SERVER_API_BASE_URL = SERVER_API_BASE_URL_PROD;
}

const commonOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
};

export const getMovieConfig = async (lang: string = 'en'): Promise<ConfigResponse> => {
    const resp = await fetch(SERVER_API_BASE_URL + `/movie/config?lang=${ lang }`, { ...commonOptions });

    return await resp.json() as ConfigResponse;
};

export const getNowPlayingMovies = async (): Promise<MovieListResponse> => {
    const resp = await fetch(SERVER_API_BASE_URL + '/movie/now_playing', { ...commonOptions });

    return await resp.json() as MovieListResponse;
};

export const getUpcomingMovies = async (): Promise<MovieListResponse> => {
    const resp = await fetch(SERVER_API_BASE_URL + '/movie/upcoming', { ...commonOptions });

    return await resp.json() as MovieListResponse;
};

export const getMovieDetails = async (
    movieId: string,
    lang: string = 'en',
    includeImageLanguage: string = 'en',
    posters_count: number = 10,
    logos_count: number = 10,
    backdrops_count: number = 10,
): Promise<MovieDetailsResponse> => {
    const resp = await fetch(
        `${ SERVER_API_BASE_URL }/movie/${ movieId }?lang=${ lang }&include_image_language=${ includeImageLanguage }&posters_count=${ posters_count }&logos_count=${ logos_count }&backdrops_count=${ backdrops_count }`,
        { ...commonOptions },
    );

    return await resp.json() as MovieDetailsResponse;
};

export const getMovieCredits = async (movieId: string, lang: string = 'en-US', cast_count: number = 10): Promise<MovieCreditsResponse> => {
    const resp = await fetch(
        `${ SERVER_API_BASE_URL }/movie/${ movieId }/credits?lang=${ lang }&cast_count=${ cast_count }`,
        { ...commonOptions },
    );

    return await resp.json() as MovieCreditsResponse;
};

export const getMovieSchedule = async (movieId: string): Promise<MovieScheduleResponse> => {
    const resp = await fetch(
        `${ SERVER_API_BASE_URL }/movie/${ movieId }/schedule`,
        { ...commonOptions },
    );

    return await resp.json() as MovieScheduleResponse;
};

export const getTakenSeats = async (movieId: string, showId: string): Promise<ShowTakenSeats> => {
    const resp = await fetch(
        `${ SERVER_API_BASE_URL }/movie/${ movieId }/taken_seats?show_id=${ showId }`,
        { ...commonOptions },
    );

    return await resp.json() as ShowTakenSeats;
};

export const getMyTickets = async (ownerId: number): Promise<TicketsResponse> => {
    const resp = await fetch(
        `${ SERVER_API_BASE_URL }/movie/tickets?owner_id=${ ownerId }`,
        { ...commonOptions },
    );

    return await resp.json() as TicketsResponse;
};

export const createInvoice = async (data: CreateInvoiceRequestBody): Promise<CreateInvoiceResponse> => {
    const resp = await fetch(
        `${ SERVER_API_BASE_URL }/booking/invoice`,
        {
            ...commonOptions,
            method: 'POST',
            body: JSON.stringify(data),
        },
    );

    return await resp.json() as CreateInvoiceResponse;
};
