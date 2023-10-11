/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import app from '../services/AppController';
import { MoviePosterLabel, MovieStarRating } from './';
import { DAYS_SINCE_RELEASE_PREMIERE, DAYS_UNTIL_RELEASE_AVAILABLE } from '../consts';
import { MovieListItem } from '../../../shared';

type MovieCellProps = {
    movie: MovieListItem;
    posterBaseUrl: string;
    posterSize: string;
}

const MovieCell = ({ movie, posterBaseUrl, posterSize }: MovieCellProps): JSX.Element => {
    const { t } = useTranslation();
    const daysSinceRelease: number = (Date.now() - Date.parse(movie.release_date)) / 1000 / 60 / 60 / 24,
        isPremiere: boolean = daysSinceRelease > 0 && daysSinceRelease < DAYS_SINCE_RELEASE_PREMIERE,
        isAvailableNow: boolean = daysSinceRelease < 0 && Math.abs(daysSinceRelease) < DAYS_UNTIL_RELEASE_AVAILABLE;
    const onClickHandler = () => {
        app.brr.impact('light');
    };

    return (
        <>
            <Link to={ `${ movie.id }` } state={ { movie } } onClick={ onClickHandler }
                  className="movie-cell text-decoration-none text-body fs-6">
                <div className="rounded overflow-hidden position-relative">
                    <img className="movie-poster w-100"
                         src={ movie.poster_path && `${ posterBaseUrl }${ posterSize }${ movie.poster_path }` || '/assets/no_photo.jpg' }
                         alt={ movie.title } />
                    {
                        isPremiere && <MoviePosterLabel label={ t('movies.movie_label_premiere') } /> || <></>
                    }
                    {
                        isAvailableNow && <MoviePosterLabel label={ t('movies.movie_label_available_now') } /> || <></>
                    }
                </div>
                <div className="pt-2 pb-4">
                    <p className="m-0 fw-normal lh-sm">{ movie.title }</p>
                    <p className="m-0 fs-5">
                        <MovieStarRating rating={ movie.vote_average / 2 } />
                    </p>
                </div>
            </Link>
        </>
    );
};

export default MovieCell;
