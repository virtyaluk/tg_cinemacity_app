/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import { Router, Request, Response } from 'express';
import {
    getConfigDetails,
    getMovieImages,
    getMovieDetails,
    getNowPlaying,
    getUpcoming,
    getMovieCredits,
    getMovieGenres,
} from '../../services/tmdb.js';
import { getInfo } from '../../services/imdb.js';
import {
    getHallSchema,
    getTicketPrices,
    getShowTimeSlots,
    getTakenSeats,
    getMyTickets,
} from '../../services/booking.js';
import { MovieImage } from '../../models/services/tmdb.js';
import {
    NowPlayingQueryParams,
    MovieListResponse,
    GetMovieByIdQueryParams,
    MovieDetailsResponse,
    ConfigResponse,
    GetMovieCreditsByIdQueryParams,
    MovieCreditsResponse,
    GetConfigQueryParams,
    MovieScheduleResponse,
    ShowTakenSeats,
    GetShowTakenSeatsQueryParams,
    TicketsResponse,
    GetTicketsQueryParams,
    ErrorResponse,
} from '../../../../shared';

interface MovieRouterParams {
    id: string;
}

const movieRouter = Router();
const movieImagesMapperFn = ({ height, width, file_path }: MovieImage) => ({ height, width, file_path });

// api/movie/now_playing
movieRouter.get('/now_playing', async (
    req: Request<{}, {}, {}, NowPlayingQueryParams>,
    res: Response<MovieListResponse | ErrorResponse>,
) => {
    try {
        const { lang, page, region } = req.query;
        const nowPlaying = await getNowPlaying(lang, parseInt(page ?? '1'), region);
        const resp: MovieListResponse = {
            page: nowPlaying.page,
            total_pages: nowPlaying.total_pages,
            movies: nowPlaying.results.map(({
                                                title,
                                                id,
                                                backdrop_path,
                                                poster_path,
                                                release_date,
                                                genre_ids,
                                                vote_average,
                                            }) => ({
                id,
                title,
                poster_path,
                backdrop_path,
                release_date,
                genre_ids,
                vote_average,
            })),
        };

        res.json(resp);
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/movie/now_playing ERROR: ', ex);
    }
});

// api/movie/upcoming
movieRouter.get('/upcoming', async (
    req: Request<{}, {}, {}, NowPlayingQueryParams>,
    res: Response<MovieListResponse | ErrorResponse>,
) => {
    try {

        const { lang, page, region } = req.query;
        const nowPlaying = await getUpcoming(lang, parseInt(page ?? '1'), region);
        const resp: MovieListResponse = {
            page: nowPlaying.page,
            total_pages: nowPlaying.total_pages,
            movies: nowPlaying.results.map(({
                                                title,
                                                id,
                                                backdrop_path,
                                                poster_path,
                                                release_date,
                                                genre_ids,
                                                vote_average,
                                            }) => ({
                id,
                title,
                poster_path,
                backdrop_path,
                release_date,
                genre_ids,
                vote_average,
            })),
        };

        res.json(resp);
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/movie/upcoming ERROR: ', ex);
    }
});

// api/movie/config
movieRouter.get('/config', async (
    req: Request<{}, {}, {}, GetConfigQueryParams>,
    res: Response<ConfigResponse | ErrorResponse>,
) => {
    try {
        const { lang } = req.query;
        const { images } = await getConfigDetails();
        const { genres } = await getMovieGenres(lang);
        const resp: ConfigResponse = {
            images: {
                base_url: images.base_url,
                secure_base_url: images.secure_base_url,
                backdrop_sizes: images.backdrop_sizes,
            },
            genres,
        };

        res.json(resp);
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/movie/config ERROR: ', ex);
    }
});


// api/movie/tickets?owner_id=?
movieRouter.get('/tickets', async (
    req: Request<{}, {}, {}, GetTicketsQueryParams>,
    res: Response<TicketsResponse | ErrorResponse>,
) => {
    try {
        const myTickets = await getMyTickets(req.query.owner_id);
        const resp: TicketsResponse = {
            tickets: myTickets.map(({ runtime, title, code, seats, date, time, poster_path }) => ({
                runtime, title, code, seats, date, time, poster_path,
            })),
            num_tickets: myTickets.length,
        };

        res.json(resp);
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/movie/tickets ERROR: ', ex);
    }
});

// api/movie/:id
movieRouter.get('/:id', async (
    req: Request<MovieRouterParams, {}, {}, GetMovieByIdQueryParams>,
    res: Response<MovieDetailsResponse | ErrorResponse>,
) => {
    try {
        const movieId: number = parseInt(req.params.id),
            {
                lang,
                include_image_language,
                posters_count,
                logos_count,
                backdrops_count,
            } = req.query,
            {
                id,
                title,
                overview,
                tagline,
                release_date,
                runtime,
                poster_path,
                backdrop_path,
                genres,
                vote_average,
                vote_count,
                imdb_id,
            } = await getMovieDetails(movieId, lang),
            { backdrops, posters, logos } = await getMovieImages(movieId, lang, include_image_language),
            imdbMovieInfo = await getInfo(imdb_id),
            resp: MovieDetailsResponse = {
                id,
                title,
                overview,
                tagline,
                release_date,
                runtime,
                poster_path,
                backdrop_path,
                vote_average,
                vote_count,
                imdb_id,
                imdb_info: {
                    ...imdbMovieInfo,
                },
                genres: genres.map(g => g.name),
                backdrops: backdrops.map(movieImagesMapperFn).slice(0, backdrops_count),
                posters: posters.map(movieImagesMapperFn).slice(0, posters_count),
                logos: logos.map(movieImagesMapperFn).slice(0, logos_count),
            };

        res.json(resp);
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/movie/:id ERROR: ', ex);
    }
});

// api/movie/:id/credits?lang=&cast_count=
movieRouter.get('/:id/credits', async (
    req: Request<MovieRouterParams, {}, {}, GetMovieCreditsByIdQueryParams>,
    res: Response<MovieCreditsResponse | ErrorResponse>,
) => {
    try {
        const movieId: number = parseInt(req.params.id);
        const { lang, cast_count } = req.query;
        const { id, cast } = await getMovieCredits(movieId, lang);
        const resp: MovieCreditsResponse = {
            id,
            cast: cast.slice(0, cast_count).map(({ id, name, profile_path }) => ({ id, name, profile_path })),
        };

        res.json(resp);
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/movie/:id/credits ERROR: ', ex);
    }
});

// api/movie/:id/schedule
movieRouter.get('/:id/schedule', async (
    req: Request<MovieRouterParams>,
    res: Response<MovieScheduleResponse | ErrorResponse>,
) => {
    try {
        const movieId: number = parseInt(req.params.id);
        const hallSchema = await getHallSchema();
        const ticketPrices = await getTicketPrices();
        const showTimeSlots = await getShowTimeSlots(movieId);
        const resp: MovieScheduleResponse = {
            hall_schema: hallSchema,
            ticket_prices: ticketPrices,
            showtime_slots: showTimeSlots,
        };

        res.json(resp);
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/movie/:id/schedule ERROR: ', ex);
    }
});

// api/movie/:id/taken_seats?show_id=
movieRouter.get('/:id/taken_seats', async (
    req: Request<MovieRouterParams, {}, {}, GetShowTakenSeatsQueryParams>,
    res: Response<ShowTakenSeats | ErrorResponse>,
) => {
    try {
        const movieId = parseInt(req.params.id);
        const queryParams = req.query;
        const takenSeats = await getTakenSeats(`${ movieId }_${ queryParams.show_id }`);
        const resp: ShowTakenSeats = {
            taken_seats: takenSeats,
        };

        res.json(resp);
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/movie/:id/taken_seats ERROR: ', ex);
    }
});

export default movieRouter;
