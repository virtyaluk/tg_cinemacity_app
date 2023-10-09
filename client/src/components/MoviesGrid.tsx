/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MovieContext } from '../context/MovieContext';
import { MovieStarRating } from './index';
import { getPoster } from '../utils';
import { DAYS_SINCE_RELEASE_PREMIERE, DAYS_UNTIL_RELEASE_AVAILABLE } from '../consts';
import { MovieListItem } from '../../../shared';
import './MovieGrid.scss';

type MoviesGridProps = {
    movies: MovieListItem[];
    genres: Set<number>;
};

type MovieCellProps = {
    movie: MovieListItem;
    posterBaseUrl: string;
    posterSize: string;
}

type MoviePosterLabelProps = {
    label: string;
}

const MoviePosterLabel = ({ label }: MoviePosterLabelProps): JSX.Element => (
    <>
        <div className='position-absolute w-100 bottom-0 start-0 bg-warning p-1 text-center'>
            <p className='m-0 fw-medium fst-italic fs-5'>{ label }</p>
        </div>
    </>
);

const MovieCell = ({ movie, posterBaseUrl, posterSize }: MovieCellProps): JSX.Element => {
    const { t } = useTranslation();
    const daysSinceRelease: number = (Date.now() - Date.parse(movie.release_date)) / 1000 / 60 / 60 / 24,
        isPremiere: boolean = daysSinceRelease > 0 && daysSinceRelease < DAYS_SINCE_RELEASE_PREMIERE,
        isAvailableNow: boolean = daysSinceRelease < 0 && Math.abs(daysSinceRelease) < DAYS_UNTIL_RELEASE_AVAILABLE;

    return (
        <>
            <Link to={ `${ movie.id }` } className='text-decoration-none text-body fs-6'>
                <div className='rounded overflow-auto position-relative'>
                    <img className='movie-poster w-100'
                         src={ movie.poster_path && `${ posterBaseUrl }${ posterSize }${ movie.poster_path }` || '/assets/no_photo.jpg' }
                         alt={ movie.title }/>
                    {
                        isPremiere && <MoviePosterLabel label={ t('movies.movie_label_premiere') }/> || <></>
                    }
                    {
                        isAvailableNow && <MoviePosterLabel label={ t('movies.movie_label_available_now') }/> || <></>
                    }
                </div>
                <div className='pt-2 pb-4'>
                    <p className='m-0 fw-normal lh-sm'>{ movie.title }</p>
                    <p className='m-0 fs-5'>
                        <MovieStarRating rating={ movie.vote_average / 2 }/>
                    </p>
                </div>
            </Link>
        </>
    );
};

export default function MoviesGrid({ movies, genres }: MoviesGridProps): JSX.Element {
    const { movieConfig } = useContext(MovieContext),
        posterBaseUrl: string = movieConfig.images.secure_base_url,
        posterSize: string = getPoster(movieConfig.images.backdrop_sizes, 0);

    return (
        <>
            {
                movies.filter(({ genre_ids }) => !genres.size || genre_ids.some(genreId => genres.has(genreId))).map(movie =>
                    <Col key={ movie.id } xs='6'>
                        <MovieCell movie={ movie } posterBaseUrl={ posterBaseUrl } posterSize={ posterSize }/>
                    </Col>
                )
            }
        </>
    );
}
