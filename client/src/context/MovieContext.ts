/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import { createContext } from 'react';
import { ConfigResponse } from '../../../shared';

export interface MovieContextValue {
    movieConfig: ConfigResponse;
}

export const MovieContext = createContext<MovieContextValue>({ } as MovieContextValue);
