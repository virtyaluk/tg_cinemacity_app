/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import fetch, { Response } from 'node-fetch';
import {
    Configuration,
    MovieDetails,
    MovieImages,
    MovieList,
    MovieCredits,
    MovieGenresList
} from '../models/services/tmdb.js';

const baseApiUrl: string = 'https://api.themoviedb.org/3';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ process.env.TMDB_ACCESS_TOKEN }`
    }
};

const toJson = (res: Response): Promise<any> => res.json();

export async function getConfigDetails(): Promise<Configuration> {
    return await fetch(
        `${ baseApiUrl }/configuration`,
        { ...options }
    )
        .then(toJson);
}

export async function getNowPlaying(lang: string = 'en-US', page: number = 1, region: string = 'ua'): Promise<MovieList> {
    return await fetch(
        `${ baseApiUrl }/movie/now_playing?language=${ lang }&page=${ page }&region=${ region }`,
        { ...options }
    )
        .then(toJson);
}

export async function getUpcoming(lang: string = 'en-US', page: number = 1, region: string = 'ua'): Promise<MovieList> {
    return await fetch(
        `${ baseApiUrl }/movie/upcoming?language=${ lang }&page=${ page }&region=${ region }`,
        { ...options }
    )
        .then(toJson);
}

export async function getMovieDetails(movieId: number, lang: string = 'en-US'): Promise<MovieDetails> {
    if (!movieId) {
        throw new RangeError('movieId is null or empty');
    }

    return await fetch(
        `${ baseApiUrl }/movie/${ movieId }?language=${ lang }`,
        { ...options }
    )
        .then(toJson);
}

export async function getMovieImages(
    movieId: number,
    lang: string = 'en',
    includeImageLang: string = 'en'
): Promise<MovieImages> {
    if (!movieId) {
        throw new RangeError('movieId is null or empty');
    }

    return await fetch(
        `${ baseApiUrl }/movie/${ movieId }/images?include_image_language=${ includeImageLang }&language=${ lang }`,
        { ...options }
    )
        .then(toJson);
}

export async function getMovieCredits(movieId: number, lang: string = 'en-US'): Promise<MovieCredits> {
    if (!movieId) {
        throw new RangeError('movieId is null or empty');
    }

    return await fetch(
        `${ baseApiUrl }/movie/${ movieId }/credits?language=${ lang }`,
        { ...options }
    )
        .then(toJson);
}

export async function getMovieGenres(lang: string = 'en'): Promise<MovieGenresList> {
    return await fetch(
        `${ baseApiUrl }/genre/movie/list?language=${ lang }`,
        { ...options }
    )
        .then(toJson);
}
