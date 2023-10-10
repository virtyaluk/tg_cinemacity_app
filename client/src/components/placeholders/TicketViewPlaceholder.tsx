/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const TicketViewPlaceholder = () => (
    <Container className="ticket bg-white overflow-auto rounded-5 mx-4 my-2 w-auto overflow-x-hidden placeholder-glow">
        <Row>
            <Col xs={ 12 } className="p-0">
                <div className="ticket-poster w-100 placeholder"></div>
            </Col>
        </Row>
        <Row>
            <Col xs={ 12 } className="p-0">
                <div className="ticket-dash position-relative"></div>
            </Col>
        </Row>
        <Row>
            <Col xs={ 12 } className="pb-1 pt-3 text-center">
                <p className="runtime-label text-center text-muted fw-light mb-0 placeholder w-50">
                    &nbsp;
                </p>
            </Col>
            <Col xs={ 12 } className="text-center">
                <h3 className="text-center fw-bold placeholder w-75">&nbsp;</h3>
            </Col>
            <Col xs={ 12 } className="text-center">
                <p className="text-center my-1 placeholder w-25">&nbsp;</p>
            </Col>
            <Col xs={ 12 } className="text-center py-2 text-center">
                <p className="seats-label mb-0 rounded-5 border-1 border-black d-inline px-3 py-1 placeholder w-50">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
            </Col>
            <Col xs={ 12 } className="text-center pb-2 px-0">
                <p className="placeholder w-75 p-2">&nbsp;</p>
            </Col>
        </Row>
    </Container>
);

export default TicketViewPlaceholder;
