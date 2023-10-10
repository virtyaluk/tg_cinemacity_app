/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { ErrorIcon } from '../components';

export default function AppErrorView() {
    const error = useRouteError();
    console.error(error);

    return (
        <Container>
            <Row>
                <Col xs={ 12 }>
                    <ErrorIcon />
                </Col>
            </Row>
            <Row>
                <Col xs={ 12 } className='text-center'>
                    <p>
                        <i>{ error.statusText || error.message }</i>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}
