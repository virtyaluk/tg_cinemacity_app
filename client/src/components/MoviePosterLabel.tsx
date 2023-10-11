/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';

type MoviePosterLabelProps = {
    label: string;
}

const MoviePosterLabel = ({ label }: MoviePosterLabelProps): JSX.Element => (
    <>
        <div className='position-absolute w-100 bottom-0 start-0 bg-warning p-1 text-center'>
            <p className='m-0 fw-medium fst-italic fs-5'>{ label }</p>
        </div>
    </>
);

export default MoviePosterLabel;
