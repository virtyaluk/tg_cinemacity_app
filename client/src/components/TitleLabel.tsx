/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

type TitleLabelProps = {
    count: number;
}

const TitleLabel = ({ count }: TitleLabelProps): JSX.Element => {
    const { t } = useTranslation();

    return (
        <>
            <div className={ 'text-end align-baseline tg-text-muted' + (!count && ' d-none') }>
                { t('movies.title_label', { count: count }) }
            </div>
        </>
    );
};

export default TitleLabel;
