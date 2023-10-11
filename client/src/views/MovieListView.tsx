/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Container, Row, Col, ToggleButton } from 'react-bootstrap';
import autoAnimate from '@formkit/auto-animate';
import { MovieContext, MovieContextValue } from '../context/MovieContext';
import app from '../services/AppController';
import { MoviesGrid, ErrorIcon, TitleLabel } from '../components';
import { MoviesGridPlaceholder } from '../components/placeholders';
import { useSet } from '../hooks/useset';
import { getMyTickets, getNowPlayingMovies, getUpcomingMovies } from '../api';
import { APP_NAME, APP_ROUTES } from '../consts';
import { timeout } from '../utils';
import { MovieListItem, MovieGenre, Ticket } from '../../../shared';
import './MovieListView.scss';

const NUM_PLACEHOLDER_ITEMS_SHOWN: number = 4,
    LOAD_MOVIE_CELLS_ANIMATION_DELAY_MS: number = 1000,
    moviesSortFn = (a: MovieListItem, b: MovieListItem) => Date.parse(b.release_date) - Date.parse(a.release_date),
    moviesSortReverseFn = (a: MovieListItem, b: MovieListItem) => Date.parse(a.release_date) - Date.parse(b.release_date);

export default function MovieListView(): JSX.Element {
    const [nowPlayingMovies, setNowPlayingMovies] = useState<MovieListItem[]>([]);
    const [upcomingMovies, setUpcomingMovies] = useState<MovieListItem[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [appError, setAppError] = useState<boolean>(false);
    const { movieConfig }: MovieContextValue = useContext(MovieContext);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const selectedGenres: Set<number> = useSet<number>([]);
    const allCurrentGenres: Set<number> = useSet<number>([]);
    const parent1 = useRef(null);
    const parent2 = useRef(null);
    const toggleGenre = (genreId: number) => {
        if (selectedGenres.has(genreId)) {
            selectedGenres.delete(genreId);
        } else {
            selectedGenres.add(genreId);
        }
    };
    const onMainBtnClickHandler = () => {
        app.brr.impact('light');
        navigate(APP_ROUTES.TICKETS_ROUTE, {
            state: {
                tickets,
            },
        });
    };

    useEffect(() => {
        Promise.all([getNowPlayingMovies(), timeout(LOAD_MOVIE_CELLS_ANIMATION_DELAY_MS)])
            .then(([nowPlayingMoviesResp]) => {
                nowPlayingMoviesResp.movies.sort(moviesSortFn);
                setNowPlayingMovies(nowPlayingMoviesResp.movies);

                nowPlayingMoviesResp.movies
                    .forEach(
                        ({ genre_ids }) => genre_ids.forEach(genreId => allCurrentGenres.add(genreId)),
                    );

                setAppError(false);
            })
            .catch(err => {
                setAppError(true);
                app.brr.notification('error')
                console.error('an error occurred while loading now playing movies', err);
            });

        Promise.all([getUpcomingMovies(), timeout(LOAD_MOVIE_CELLS_ANIMATION_DELAY_MS)])
            .then(([upcomingMoviesResp]) => {
                upcomingMoviesResp.movies.sort(moviesSortReverseFn);
                setUpcomingMovies(upcomingMoviesResp.movies);

                upcomingMoviesResp.movies
                    .forEach(
                        ({ genre_ids }) => genre_ids.forEach(genreId => allCurrentGenres.add(genreId)),
                    );
            })
            .catch(err => {
                setAppError(true);
                app.brr.notification('error')
                console.error('an error occurred while loading upcoming movies', err);
            });

        getMyTickets(app.getUserId())
            .then(tr => {
                setTickets(tr.tickets);
            })
            .catch(err => {
                console.error('an error occurred while fetching the tickets', err);
            });
    }, []);

    useEffect(() => {
        app.mainButton
            .reset(tickets.length > 0)
            .setText(t('movies.main_btn_title'))
            .on(onMainBtnClickHandler);
        app.backButton.hide();

        return () => {
            app.mainButton
                .hide()
                .off(onMainBtnClickHandler);
        };
    }, [tickets]);

    useEffect(() => {
        parent1.current && autoAnimate(parent1.current);
        parent2.current && autoAnimate(parent2.current);
    }, [parent1, parent2]);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{ `${ t('movies.page_title') } | ${ APP_NAME }` }</title>
                </Helmet>
            </HelmetProvider>

            { appError && <ErrorIcon /> || <></> }

            <Container className={ appError && 'd-none' || '' }>
                <Row className="mt-2">
                    <Col xs="12">
                        <h3>{ t('movies.categories_section_title') }</h3>
                    </Col>
                </Row>
                <Row className="my-2 mb-3 pe-2">
                    <Col xs="12">
                        <div className="category-list">
                            <div>
                                {
                                    movieConfig.genres.filter(({ id }) => !allCurrentGenres.size || allCurrentGenres.has(id)).map(({
                                                                                                                                       id,
                                                                                                                                       name,
                                                                                                                                   }: MovieGenre, idx) =>
                                        <ToggleButton id={ name.toLowerCase().replace(' ', '_') } value={ id }
                                                      type={ 'checkbox' } key={ idx }
                                                      onClick={ () => toggleGenre(id) }
                                                      className="rounded-2 px-2 py-1 text-black border-0"
                                                      checked={ selectedGenres.has(id) }>
                                            <div>{ t(`movies.categories.${ id }`) }</div>
                                        </ToggleButton>,
                                    )
                                }
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col xs="8">
                        <h3>{ t('movies.showing_now_section_title') }</h3>
                    </Col>
                    <Col xs="4">
                        <TitleLabel count={ nowPlayingMovies.length } />
                    </Col>
                </Row>

                <div className="row my-2 mb-0" ref={ parent1 }>
                    {
                        nowPlayingMovies.length &&
                        <MoviesGrid movies={ nowPlayingMovies } genres={ selectedGenres } /> ||
                        <MoviesGridPlaceholder size={ NUM_PLACEHOLDER_ITEMS_SHOWN } />
                    }
                </div>

                <Row>
                    <Col xs="8">
                        <h3>{ t('movies.upcoming_section_title') }</h3>
                    </Col>
                    <Col xs="4">
                        <TitleLabel count={ upcomingMovies.length } />
                    </Col>
                </Row>

                <div className="row my-2 mb-0" ref={ parent2 }>
                    {
                        upcomingMovies.length &&
                        <MoviesGrid movies={ upcomingMovies } genres={ selectedGenres } /> ||
                        <MoviesGridPlaceholder size={ NUM_PLACEHOLDER_ITEMS_SHOWN } />
                    }
                </div>
            </Container>
        </>
    );
}
