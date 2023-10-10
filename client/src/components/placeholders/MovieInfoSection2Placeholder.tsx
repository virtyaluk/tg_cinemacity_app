/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

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

export default MovieInfoSection2Placeholder;
