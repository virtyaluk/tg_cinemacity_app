/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import { ConfigResponse } from '../../shared';

type Color = `#${string}`;

export const APP_NAME: string = 'Cinema City';
export const DAYS_SINCE_RELEASE_PREMIERE: number = 7;
export const DAYS_UNTIL_RELEASE_AVAILABLE: number = 7;
export const DAYS_IN_CINEMA_SINCE_RELEASE: number = 7 * 6; // 6 weeks

export const MOVIE_CONFIG_KEY: string = 'mov_cfg';
export const APP_TOUR_FINISHED_KEY: string = 'app_tour_finished';

// Cache control
export const GET_MOVIE_CONFIG_CACHE_TTL_SECONDS: number = 180 * 24 * 60 * 60; // 180 days
export const GET_NOW_PLAYING_MOVIES_CACHE_TTL_SECONDS: number = 12 * 60 * 60; // 12 hours
export const GET_UPCOMING_MOVIES_CACHE_TTL_SECONDS: number = 12 * 60 * 60; // 12 hours
export const GET_MOVIE_DETAILS_CACHE_TTL_SECONDS: number = 12 * 60 * 60; // 12 hours
export const GET_MOVIE_CREDITS_CACHE_TTL_SECONDS: number = 12 * 60 * 60; // 12 hours

export const APP_ROUTES = {
    TOUR_ROUTE: '/tour',
    TICKETS_ROUTE: '/tickets',
    MOVIES_LIST_ROUTE: '/movies',
    MOVIE_BOOKING: 'booking/',
};

export const APP_MAIN_BTN_TEXT_COLOR: Color = '#000000';
export const APP_MAIN_BTN_COLOR: Color = '#FFB800';
export const APP_MAIN_BTN_DISABLED_COLOR: Color = '#996E00';

export const INIT_MOVIE_CONFIG: ConfigResponse = {
    images: {
        'base_url': 'http://image.tmdb.org/t/p/',
        'secure_base_url': 'https://image.tmdb.org/t/p/',
        'backdrop_sizes': [
            'w300',
        ],
    },
    genres: [
        {
            'id': 28,
            'name': 'Action',
        },
        {
            'id': 12,
            'name': 'Adventure',
        },
        {
            'id': 16,
            'name': 'Animation',
        },
        {
            'id': 35,
            'name': 'Comedy',
        },
        {
            'id': 80,
            'name': 'Crime',
        },
        {
            'id': 99,
            'name': 'Documentary',
        },
        {
            'id': 18,
            'name': 'Drama',
        },
        {
            'id': 10751,
            'name': 'Family',
        },
        {
            'id': 14,
            'name': 'Fantasy',
        },
        {
            'id': 36,
            'name': 'History',
        },
        {
            'id': 27,
            'name': 'Horror',
        },
        {
            'id': 10402,
            'name': 'Music',
        },
        {
            'id': 9648,
            'name': 'Mystery',
        },
        {
            'id': 10749,
            'name': 'Romance',
        },
        {
            'id': 878,
            'name': 'Science Fiction',
        },
        {
            'id': 10770,
            'name': 'TV Movie',
        },
        {
            'id': 53,
            'name': 'Thriller',
        },
        {
            'id': 10752,
            'name': 'War',
        },
        {
            'id': 37,
            'name': 'Western',
        },
    ],
};

export const COLOR_GOLD: string = '#FFB800';
