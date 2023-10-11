/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { DAYS_IN_CINEMA_SINCE_RELEASE } from '../consts';
import { MovieDetailsResponse, MovieListItem } from '../../../shared';

interface MovieDateTagParams {
    movieDetails?: MovieDetailsResponse | MovieListItem;
}

const MovieDateTag = ({ movieDetails }: MovieDateTagParams) => {
    const { t } = useTranslation(),
        localeOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
        daysDiff: number = (Date.now() - Date.parse(movieDetails?.release_date ?? '0')) / 1000 / 60 / 60 / 24,
        titlePrefix: string = daysDiff < 0 ? 'movie_details.watch_from' : 'movie_details.in_cinema_til',
        dateParsed: Date = new Date(Date.parse(movieDetails?.release_date ?? '0')),
        showtimeEndDate: Date = new Date(dateParsed);

    showtimeEndDate.setDate(showtimeEndDate.getDate() + DAYS_IN_CINEMA_SINCE_RELEASE);

    return (
        <div className="position-absolute w-100 text-center">
            <span className="rounded-4 px-3 py-1 text-black fw-light m-0 fs-6">
                { t(titlePrefix) }
                &nbsp;
                { (daysDiff >= 0 ? showtimeEndDate : dateParsed).toLocaleDateString('en-US', localeOptions) }
            </span>
        </div>
    );
};

export default MovieDateTag;
