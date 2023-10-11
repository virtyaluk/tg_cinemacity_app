/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-bootstrap';
import { PictureChip } from './';
import { MovieCastMember, MovieDetailsResponse } from '../../../shared';

interface MovieInfoSection2Props {
    movieDetails: MovieDetailsResponse;
    movieCast: MovieCastMember[];
    imgUrlPrefix: string;
}

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
                    <p className='text-dark'>{ movieDetails.overview }</p>
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

export default MovieInfoSection2;