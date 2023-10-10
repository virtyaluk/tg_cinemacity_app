/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { Col } from 'react-bootstrap';

const CinemaHallSchemaPreloader = () => (
    <>
        {
            [...new Array(7)].map((_, idx) =>
                <Col key={ idx } xs={ 12 } className="text-center placeholder-glow my-2">
                    <div className="seat-row w-75 py-2 placeholder placeholder-lg">
                    </div>
                </Col>,
            )
        }
    </>
);

export default CinemaHallSchemaPreloader;
