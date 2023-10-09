/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from 'react-router-dom';
import {
    MovieListView,
    MovieDetailsView,
    RootView,
    MovieBookingView,
    AppTourView,
    AppErrorView,
    TicketsView,
} from './views';
import './i18n';
import './index.scss';

const router = createBrowserRouter(createRoutesFromElements(
    <Route element={ <RootView /> } errorElement={ <AppErrorView /> } path="/">
        <Route path="tour/" element={ <AppTourView /> } />
        <Route path="movies/" element={ <MovieListView /> } />
        <Route path="movies/:movieId/" element={ <MovieDetailsView /> } />
        <Route path="movies/:movieId/booking/" element={ <MovieBookingView /> } />
        <Route path="tickets/" element={ <TicketsView /> } />
    </Route>,
));

const container: HTMLElement = document.getElementById('root') as HTMLElement;
const root: Root = createRoot(container);

root.render(
    <React.StrictMode>
        <RouterProvider router={ router } />
    </React.StrictMode>,
);

if (import.meta.hot) {
    import.meta.hot.accept();
}
