/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';

type MoviesGridPlaceholderProps = {
    size: number;
}

const MoviesGridPlaceholder = ({ size }: MoviesGridPlaceholderProps): JSX.Element => (
    <>
        {
            [...new Array(size)].map((_, idx: number) =>
                <div key={ idx }
                     className="card-title placeholder-wave col-6 mb-3">
                    <div className="placeholder w-100 rounded" style={ { height: '200px' } }></div>
                    <div className="placeholder w-100 rounded"></div>
                </div>,
            )
        }
    </>
);

export default MoviesGridPlaceholder;
