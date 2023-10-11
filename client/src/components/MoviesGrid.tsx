/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';
import { MovieContext } from '../context/MovieContext';
import { MovieCell } from './';
import { getPoster } from '../utils';
import { MovieListItem } from '../../../shared';
import './MovieGrid.scss';

type MoviesGridProps = {
    movies: MovieListItem[];
    genres: Set<number>;
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
