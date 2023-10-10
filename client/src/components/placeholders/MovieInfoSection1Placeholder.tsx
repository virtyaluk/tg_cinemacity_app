/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { Col, Row } from 'react-bootstrap';

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

export default MovieInfoSection1Placeholder;
