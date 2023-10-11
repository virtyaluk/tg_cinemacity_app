/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-bootstrap';
import app from '../services/AppController';
import { getMyTickets } from '../api';
import { ErrorIcon, TicketView } from '../components';
import { TicketViewPlaceholder } from '../components/placeholders';
import { APP_NAME } from '../consts';
import { timeout } from '../utils';
import { Ticket } from '../../../shared';
import './TicketsView.scss';

const LOAD_TICKETS_ANIMATION_DELAY_MS: number = 1000;

export default function TicketsView(): JSX.Element {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [appError, setAppError] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        if (!location.state?.tickets?.length) {
            Promise.all([getMyTickets(app.getUserId()), timeout(LOAD_TICKETS_ANIMATION_DELAY_MS)])
                .then(([tr]) => {
                    setTickets(tr.tickets);
                    setAppError(false);
                })
                .catch(err => {
                    setAppError(true);
                    app.brr.notification('error');
                    console.error('an error occurred while fetching the tickets', err);
                });
        } else {
            setTickets(location.state?.tickets ?? []);
        }
    }, [location]);

    useEffect(() => {
        app.backButton.show();
        app.mainButton.hide();

        return () => {
            app.backButton.hide();
        };
    }, []);

    return (
        <div className='pb-5'>
            <HelmetProvider>
                <Helmet>
                    <title>{ `${ t('my_tickets.page_title') } | ${ APP_NAME }` }</title>
                </Helmet>
            </HelmetProvider>

            { appError && <ErrorIcon /> || <></> }

            <Carousel touch={ true } controls={ false } interval={ null }>
                {
                    tickets.length && tickets.map((t, idx) => <Carousel.Item key={ idx }>
                        <TicketView ticket={ t } />
                    </Carousel.Item>) || <Carousel.Item>
                        <TicketViewPlaceholder />
                    </Carousel.Item>
                }
            </Carousel>
        </div>
    );
}
