/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { COLOR_GOLD } from '../consts';

interface MovieRatingProps {
    rating: string | number;
}

const MovieIMDBRatingTag = ({ rating }: MovieRatingProps) => (
    <>
        <span>&nbsp;·&nbsp;</span>
        <span><FontAwesomeIcon icon={ faStar } size="xs" color={ COLOR_GOLD } /></span>
        <span>&nbsp;{ rating } IMDB</span>
    </>
);

export default MovieIMDBRatingTag;
