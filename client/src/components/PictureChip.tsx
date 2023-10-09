/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import './PictureChip.scss';

function PictureChip({ url }: InferProps<typeof PictureChip.propTypes>) {
    return (
        <div className={'picture-chip'} style={ {
            backgroundImage: `url('${ url}')`
        } }>
        </div>
    );
}

PictureChip.propTypes = {
    url: PropTypes.string
};

export default PictureChip;
