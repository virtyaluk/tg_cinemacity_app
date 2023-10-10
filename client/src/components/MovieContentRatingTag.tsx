/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';

interface MovieRatingProps {
    rating: string | number;
}

const MovieContentRatingTag = ({ rating }: MovieRatingProps) => (
    <>
        &nbsp;
        <span className="cr-badge badge border border-1 border-white p-1 rounded fw-light align-middle">
            { rating }
        </span>
    </>
);

export default MovieContentRatingTag;
