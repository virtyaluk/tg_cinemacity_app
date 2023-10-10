/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, ScrollRestoration } from 'react-router-dom';
import localforage from 'localforage';
import { AnimatePresence } from 'framer-motion';
import { MovieContext } from '../context/MovieContext';
import { getMovieConfig } from '../api';
import app from '../services/AppController';
import {
    INIT_MOVIE_CONFIG,
    MOVIE_CONFIG_KEY,
    APP_TOUR_FINISHED_KEY,
    APP_ROUTES,
} from '../consts';
import { ConfigResponse } from '../../../shared';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RootView(): JSX.Element {
    const [movieConfig, setMovieConfig] = useState<ConfigResponse>(INIT_MOVIE_CONFIG);
    const navigate = useNavigate();
    const onBackBtnClickHandler = () => {
        history.back();
    };

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
        // navigate(APP_ROUTES.MOVIES_LIST_ROUTE);
        // navigate(APP_ROUTES.TOUR_ROUTE);
        // navigate(APP_ROUTES.TICKETS_ROUTE);
        // navigate('movies/897087/booking/');

        app.storage
            .getItem(APP_TOUR_FINISHED_KEY)
            .then(result => {
                if (result && result == 'true') {
                    navigate(APP_ROUTES.MOVIES_LIST_ROUTE);
                } else {
                    navigate(APP_ROUTES.TICKETS_ROUTE);
                }
            });

        app
            .ready()
            .expand();
    }, []);

    useEffect(() => {
        app.backButton.on(onBackBtnClickHandler);
        app.mainButton.setParams({
            color: '#FFB800',
            text_color: '#000000',
        });

        return () => {
            app.backButton.off(onBackBtnClickHandler);
        };
    }, []);

    return (
        <MovieContext.Provider value={ { movieConfig } }>
            <AnimatePresence>
                <Outlet />
            </AnimatePresence>

            <ScrollRestoration />
        </MovieContext.Provider>
    );
}
