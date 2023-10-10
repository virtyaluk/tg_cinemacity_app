/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Container, Row, Col } from 'react-bootstrap';
import autoAnimate from '@formkit/auto-animate';
import { getMovieDetails, getMovieCredits } from '../api';
import { ErrorIcon, MovieInfoSection1, MovieInfoSection2, MovieDateTag } from '../components';
import {
    MovieInfoSection1Placeholder,
    MovieInfoSection2Placeholder,
    MovieDateTagPlaceholder,
} from '../components/placeholders';
import app from '../services/AppController';
import { MovieContext } from '../context/MovieContext';
import {
    APP_NAME,
    APP_ROUTES,
    DAYS_UNTIL_RELEASE_AVAILABLE,
    DAYS_IN_CINEMA_SINCE_RELEASE,
} from '../consts';
import { getPoster } from '../utils';
import { MovieDetailsResponse, MovieCastMember } from '../../../shared';
import './MovieDetailsView.scss';

export default function MovieDetailsView() {
    const { movieId } = useParams();
    const [movieDetails, setMovieDetails] = useState<MovieDetailsResponse>();
    const [movieCast, setMovieCast] = useState<MovieCastMember[]>([]);
    const [appError, setAppError] = useState<boolean>(false);
    const { movieConfig } = useContext(MovieContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const parent1 = useRef(null);
    const parent2 = useRef(null);
    const parent3 = useRef(null);
    const posterSize: string = getPoster(movieConfig.images.backdrop_sizes, 1),
        imgUrlPrefix: string = `${ movieConfig.images.secure_base_url }${ posterSize }`;
    const onMainBtnClickHandler = () => {
        navigate(APP_ROUTES.MOVIE_BOOKING);
    };

    useEffect(() => {
        // Load movie details.
        getMovieDetails(movieId ?? '', 'en', 'en', 0, 0, 0)
            .then(movieDetailsResp => {
                setMovieDetails(movieDetailsResp);
            })
            .catch(err => {
                setAppError(true);
                console.error('an error occurred while loading movie details', err);
            });

        // Load movie cast.
        getMovieCredits(movieId ?? '', 'en-US', 10)
            .then(movieCastResp => {
                setMovieCast(movieCastResp.cast);
            })
            .catch(err => {
                setAppError(true);
                console.error('an error occurred while loading movie cast', err);
            });
    }, []);

    useEffect(() => {
        app.mainButton
            .reset(false)
            .setText(t('movie_details.main_btn_title'));
        app.backButton.show();

        return () => {
            app.backButton.hide();
        };
    }, []);

    useEffect(() => {
        if (!movieDetails) {
            return;
        }

        const daysSinceRelease: number = (Date.now() - Date.parse(movieDetails.release_date)) / 1000 / 60 / 60 / 24,
            isAvailableNow: boolean = daysSinceRelease < 0 && Math.abs(daysSinceRelease) < DAYS_UNTIL_RELEASE_AVAILABLE;

        ((daysSinceRelease >= 0 && daysSinceRelease <= DAYS_IN_CINEMA_SINCE_RELEASE) || isAvailableNow) && app.mainButton.on(onMainBtnClickHandler).show();

        return () => {
            app.mainButton
                .hide()
                .off(onMainBtnClickHandler);
        };
    }, [movieDetails]);

    useEffect(() => {
        parent1.current && autoAnimate(parent1.current);
        parent2.current && autoAnimate(parent2.current);
        parent3.current && autoAnimate(parent3.current);
    }, [parent1, parent2, parent3]);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{ `${ movieDetails?.title } | ${ APP_NAME }` }</title>
                </Helmet>
            </HelmetProvider>

            { appError && <ErrorIcon /> || <></> }

            <div
                className={ 'movie-main-poster d-flex align-items-start flex-column text-white w-100' + (appError && ' d-none' || '') }
                style={ { backgroundImage: `url(' ${ movieDetails ? movieDetails.poster_path ? imgUrlPrefix + movieDetails?.poster_path : '/assets/no_photo.jpg' : '' }')` } }>
                <div className="mb-auto p-2"></div>
                <Container className="pt-4" ref={ parent1 }>
                    {
                        movieDetails && <MovieInfoSection1 movieDetails={ movieDetails } /> ||
                        <MovieInfoSection1Placeholder />
                    }
                    <Row>
                        <Col xs={ 12 } className="p-0 mt-3">
                            <div className="movie-date-tag w-100 position-relative bg-white rounded-5 rounded-bottom-0"
                                 ref={ parent3 }>
                                {
                                    movieDetails && <MovieDateTag movieDetails={ movieDetails } /> ||
                                    <MovieDateTagPlaceholder />
                                }
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={ 'bg-white' + (appError ? ' d-none' : '') } ref={ parent2 }>
                {
                    movieDetails && <MovieInfoSection2 movieDetails={ movieDetails } movieCast={ movieCast }
                                                       imgUrlPrefix={ imgUrlPrefix } /> ||
                    <MovieInfoSection2Placeholder />
                }
            </div>
        </>
    );
}
