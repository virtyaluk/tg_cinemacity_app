/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { PictureChip, ErrorIcon } from '../components';
import { getMovieDetails, getMovieCredits } from '../api';
import appController from '../services/AppController';
import { MovieContext } from '../context/MovieContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
    APP_NAME,
    DAYS_UNTIL_RELEASE_AVAILABLE,
    DAYS_IN_CINEMA_SINCE_RELEASE,
    COLOR_GOLD,
} from '../consts';
import { getPoster, timeout } from '../utils';
import { MovieDetailsResponse, MovieCastMember } from '../../../shared';
import './MovieDetailsView.scss';
import autoAnimate from '@formkit/auto-animate';

interface MovieRatingProps {
    rating: string | number;
}

interface MovieInfoSection1Props {
    movieDetails: MovieDetailsResponse;
}

interface MovieInfoSection2Props {
    movieDetails: MovieDetailsResponse;
    movieCast: MovieCastMember[];
    imgUrlPrefix: string;
}

interface MovieDateTagParams {
    movieDetails: MovieDetailsResponse;
}

const MovieContentRatingTag = ({ rating }: MovieRatingProps) => (
    <>
        &nbsp;
        <span
            className="cr-badge badge border border-1 border-white p-1 rounded fw-light align-middle">{ rating }</span>
    </>
);

const MovieIMDBRatingTag = ({ rating }: MovieRatingProps) => (
    <>
        <span>&nbsp;·&nbsp;</span>
        <span><FontAwesomeIcon icon={ faStar } size="xs" color={ COLOR_GOLD } /></span>
        <span>&nbsp;{ rating } IMDB</span>
    </>
);

const MovieInfoSection1 = ({ movieDetails }: MovieInfoSection1Props) => {
    const { t } = useTranslation(),
        runtimeStr = `${ Math.floor((movieDetails.runtime ?? 0) / 60) }${ t('general.hours_short') } ${ (movieDetails.runtime ?? 0) % 60 }${ t('general.minutes_short') }`;

    return (
        <>
            <Row>
                <Col xs="12">
                    <h3 className="lh-sm mb-0">
                        { movieDetails.title }
                        {
                            movieDetails.imdb_info.content_rating &&
                            <MovieContentRatingTag rating={ movieDetails.imdb_info.content_rating } /> || <></>
                        }
                    </h3>
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <p className="mb-0 lh-1 fs-6">
                        <span>{ movieDetails.genres.slice(0, 3).map(g => t(g)).join(', ') }</span>
                        <span>&nbsp;·&nbsp;</span>
                        <span>{ runtimeStr }</span>
                        {
                            movieDetails.vote_average > 0.0 && <>
                                <br />
                                <span><FontAwesomeIcon icon={ faStar } size="xs" color={ COLOR_GOLD } /></span>
                                <span>&nbsp;{ `${ movieDetails.vote_average.toFixed(1) } (${ movieDetails.vote_count })` }</span>
                            </> || <></>
                        }
                        {
                            (movieDetails.imdb_info.rating && movieDetails.imdb_info.rating > 0) &&
                            <MovieIMDBRatingTag rating={ movieDetails.imdb_info.rating } /> || <></>
                        }
                    </p>
                </Col>
            </Row>
        </>
    );
};

const MovieInfoSection2 = ({ movieDetails, movieCast, imgUrlPrefix }: MovieInfoSection2Props) => {
    const { t } = useTranslation();

    return (
        <Container className="pb-2">
            <Row>
                <Col xs="12">
                    <h3>{ t('movie_details.synopsis_section_title') }</h3>
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <p>{ movieDetails.overview }</p>
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <h3>{ t('movie_details.cast_section_title') }</h3>
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    <div>
                        {
                            movieCast.filter(({ profile_path }) => profile_path).map(({ profile_path, id }) =>
                                <PictureChip key={ id }
                                             url={ `${ imgUrlPrefix }${ profile_path }` } />)
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

const MovieInfoSection1Placeholder = () => (
    <>
        <Row className="placeholder-wave">
            <Col xs="12">
                <div className="w-100 placeholder placeholder-lg"></div>
            </Col>
        </Row>
        <Row className="placeholder-wave mb-2">
            <Col xs="12">
                <div className="w-100 placeholder placeholder"></div>
                <div className="w-100 placeholder placeholder"></div>
            </Col>
        </Row>
    </>
);

const MovieInfoSection2Placeholder = () => (
    <Container className="pb-2 placeholder-wave">
        <Row>
            <Col xs="12">
                <div className="w-100 placeholder placeholder-lg"></div>
            </Col>
        </Row>
        <Row>
            <Col xs="12">
                <div className="w-100 placeholder placeholder-sm"></div>
                <div className="w-100 placeholder placeholder-sm"></div>
                <div className="w-100 placeholder placeholder-sm"></div>
                <div className="w-100 placeholder placeholder-sm"></div>
            </Col>
        </Row>
        <Row>
            <Col xs="12" className="mt-2">
                <div className="w-100 placeholder placeholder-lg"></div>
            </Col>
        </Row>
        <Row>
            <Col xs="12" className="mt-2">
                {
                    [...new Array(10)].map((_, idx) =>
                        <div key={ idx } style={ { width: '50px', height: '50px' } }
                             className="placeholder rounded-5 me-2 mb-1"></div>)
                }
            </Col>
        </Row>
    </Container>
);

const MovieDateTag = ({ movieDetails }: MovieDateTagParams) => {
    const { t } = useTranslation(),
        localeOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
        daysDiff: number = (Date.now() - Date.parse(movieDetails.release_date)) / 1000 / 60 / 60 / 24,
        titlePrefix: string = daysDiff < 0 ? 'movie_details.watch_from' : 'movie_details.in_cinema_til',
        dateParsed: Date = new Date(Date.parse(movieDetails.release_date)),
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

const MovieDateTagPlaceholder = () => (
    <div className="position-absolute w-100 text-center placeholder-glow">
        <div className="w-50 rounded-4 px-3 py-1 text-black fw-light m-0 fs-6 placeholder">&nbsp;&nbsp;&nbsp;</div>
    </div>
);

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
    const navigationThroughMovieDetailsHandler = () => {
        navigate('booking/');
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
        appController.mainButton?.setText(t('movie_details.main_btn_title'));
    }, []);

    useEffect(() => {
        if (!movieDetails) {
            return;
        }

        const daysSinceRelease: number = (Date.now() - Date.parse(movieDetails.release_date)) / 1000 / 60 / 60 / 24,
            isAvailableNow: boolean = daysSinceRelease < 0 && Math.abs(daysSinceRelease) < DAYS_UNTIL_RELEASE_AVAILABLE;

        ((daysSinceRelease >= 0 && daysSinceRelease <= DAYS_IN_CINEMA_SINCE_RELEASE) || isAvailableNow) && appController.mainButton?.on(navigationThroughMovieDetailsHandler).show();

        return () => {
            appController.mainButton?.hide().off();
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
                            <div className="movie-date-tag w-100 position-relative rounded-5 rounded-bottom-0"
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
            <div className={ appError ? 'd-none' : '' } ref={ parent2 }>
                {
                    movieDetails && <MovieInfoSection2 movieDetails={ movieDetails } movieCast={ movieCast }
                                                       imgUrlPrefix={ imgUrlPrefix } /> ||
                    <MovieInfoSection2Placeholder />
                }
            </div>
        </>
    );
}
