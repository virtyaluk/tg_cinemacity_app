import { createContext } from 'react';
import { ConfigResponse } from '../../../shared';

export interface MovieContextValue {
    movieConfig: ConfigResponse;
}

export const MovieContext = createContext<MovieContextValue>({ } as MovieContextValue);
