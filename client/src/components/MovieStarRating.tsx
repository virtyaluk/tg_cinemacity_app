/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import './MovieStarRating.scss';

type MovieStarRatingProps = {
    rating: number;
    size?: SizeProp
}

const MovieStarRating = ({ rating, size }: MovieStarRatingProps) => (
    <>
        {
            [...new Array(Math.trunc(rating))].map((_, idx: number) => <FontAwesomeIcon key={ idx } icon={ faStar }
                                                                                        className={ 'star-filled' }
                                                                                        size={ size ?? 'xs' }/>)
        }
        {
            (rating - Math.trunc(rating)) &&
            <FontAwesomeIcon icon={ faStarHalfStroke } size={ size ?? 'xs' } className={ 'star-filled' }/> || <></>
        }
        {
            [...new Array(Math.trunc(5 - rating))].map((_, idx: number) => <FontAwesomeIcon key={ idx } icon={ faStar }
                                                                                            className={ 'star-empty' }
                                                                                            size={ size ?? 'xs' }/>)
        }
    </>
);

export default MovieStarRating;
