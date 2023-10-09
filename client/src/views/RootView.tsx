import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, ScrollRestoration } from 'react-router-dom';
import localforage from 'localforage';
import { AnimatePresence } from 'framer-motion';
import { MovieContext } from '../context/MovieContext';
import { getMovieConfig } from '../api';
import appController from '../services/AppController';
import { DebugButton } from '../components';
import {
    INIT_MOVIE_CONFIG,
    MOVIE_CONFIG_KEY,
    APP_TOUR_FINISHED_KEY,
} from '../consts';
import { ConfigResponse } from '../../../shared';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RootView(): JSX.Element {
    const [movieConfig, setMovieConfig] = useState<ConfigResponse>(INIT_MOVIE_CONFIG);
    const navigate = useNavigate();

    useEffect(() => {
        localforage
            .getItem<ConfigResponse>(MOVIE_CONFIG_KEY)
            .then(movieConfigData => {
                if (!movieConfigData) {
                    return getMovieConfig();
                }

                return movieConfigData;
            })
            .then(movieConfigData => {
                setMovieConfig(movieConfigData);

                return localforage.setItem(MOVIE_CONFIG_KEY, movieConfigData);
            })
            .catch((error) => {
                console.error('an error occurred while fetching the movie config data', error);
            });

        // navigate('/movies/792293');
        // navigate('/movies');
        // navigate('/tour');
        // navigate('tickets/');
        // navigate('movies/897087/booking/');

        appController.storage
            .getItem(APP_TOUR_FINISHED_KEY)
            .then(result => {
                if (result && result == 'true') {
                    navigate('/movies');
                } else {
                    navigate('/tour');
                }
            });

        appController
            .ready()
            .expand();
    }, []);

    return (
        <MovieContext.Provider value={ { movieConfig } }>
            <DebugButton />

            <AnimatePresence>
                <Outlet />
            </AnimatePresence>

            <ScrollRestoration />
        </MovieContext.Provider>
    );
}
