import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { COLOR_GOLD } from '../consts';
import { MovieContentRatingTag, MovieIMDBRatingTag } from './';
import { MovieDetailsResponse } from '../../../shared';

interface MovieInfoSection1Props {
    movieDetails: MovieDetailsResponse;
}

const MovieInfoSection1 = ({ movieDetails }: MovieInfoSection1Props) => {
    const { t } = useTranslation(),
        runtimeStr = `${ Math.floor((movieDetails.runtime ?? 0) / 60) }${ t('general.hours_short') } ${ (movieDetails.runtime ?? 0) % 60 }${ t('general.minutes_short') }`;

    return (
        <>
            <Row>
                <Col xs="12">
                    <h3 className="lh-sm mb-0 text-light">
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
                    <p className="mb-0 lh-1 fs-6 text-light">
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

export default MovieInfoSection1;
