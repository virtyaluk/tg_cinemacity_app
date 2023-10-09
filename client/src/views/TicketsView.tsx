/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Container, Carousel, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockFour } from '@fortawesome/free-solid-svg-icons';
import Barcode from 'react-barcode';
import { MovieContext } from '../context/MovieContext';
import { getPoster } from '../utils';
import { APP_NAME } from '../consts';
import { Ticket } from '../../../shared';
import './TicketsView.scss';

interface TicketViewProps {
    ticket: Ticket;
}

const TicketView = ({ ticket }: TicketViewProps) => {
    const { t } = useTranslation();
    const { movieConfig } = useContext(MovieContext);
    const runtimeStr = `${ Math.floor((ticket.runtime ?? 0) / 60) }${ t('general.hours_short') } ${ (ticket.runtime ?? 0) % 60 }${ t('general.minutes_short') }`,
        posterSize: string = getPoster(movieConfig.images.backdrop_sizes, 1),
        imgUrlPrefix: string = `${ movieConfig.images.secure_base_url }${ posterSize }`,
        dt = new Date(ticket.datetime * 1000),
        time = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date = dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    return (
        <Container className="ticket bg-white overflow-auto rounded-5 mx-4 my-5 w-auto overflow-x-hidden">
            <Row>
                <Col xs={ 12 } className="p-0">
                    <div className="ticket-poster w-100"
                         style={ { backgroundImage: `url('${ imgUrlPrefix }${ ticket.poster_path }')` } }></div>
                </Col>
            </Row>
            <Row>
                <Col xs={ 12 } className="p-0">
                    <div className="ticket-dash position-relative"></div>
                </Col>
            </Row>
            <Row>
                <Col xs={ 12 } className="pb-1 pt-3">
                    <p className="runtime-label text-center text-muted fw-light mb-0">
                        <FontAwesomeIcon icon={ faClockFour } size={ 'sm' } />
                        &nbsp;&nbsp;
                        <span>{ runtimeStr }</span>
                    </p>
                </Col>
                <Col xs={ 12 }>
                    <h3 className="text-center fw-bold">{ ticket.title }</h3>
                </Col>
                <Col xs={ 12 }>
                    <p className="text-center my-1">{ date }, { time }</p>
                </Col>
                <Col xs={ 12 } className="text-center py-2">
                    <p className="seats-label mb-0 rounded-5 border-1 border-black d-inline px-3 py-1">
                        <span className="text-muted">{ t('my_tickets.seats_label') }: </span>{
                        ticket.seats.map(({ row, seat }) => `${ row }x${ seat }`).join(', ')
                    }</p>
                </Col>
                <Col xs={ 12 } className="text-center pb-2 px-0">
                    <Barcode format={ 'CODE39' } value={ ticket.code } width={ 1.2 } height={ 40 }
                             background={ 'transparent' } displayValue={ false } />
                </Col>
            </Row>
        </Container>
    );
};

const TicketViewPlaceholder = () => (
    <Container className="ticket bg-white overflow-auto rounded-5 mx-4 my-5 w-auto overflow-x-hidden placeholder-glow">
        <Row>
            <Col xs={ 12 } className="p-0">
                <div className="ticket-poster w-100 placeholder"></div>
            </Col>
        </Row>
        <Row>
            <Col xs={ 12 } className="p-0">
                <div className="ticket-dash position-relative"></div>
            </Col>
        </Row>
        <Row>
            <Col xs={ 12 } className="pb-1 pt-3 text-center">
                <p className="runtime-label text-center text-muted fw-light mb-0 placeholder w-50">
                    &nbsp;
                </p>
            </Col>
            <Col xs={ 12 } className="text-center">
                <h3 className="text-center fw-bold placeholder w-75">&nbsp;</h3>
            </Col>
            <Col xs={ 12 } className="text-center">
                <p className="text-center my-1 placeholder w-25">&nbsp;</p>
            </Col>
            <Col xs={ 12 } className="text-center py-2 text-center">
                <p className="seats-label mb-0 rounded-5 border-1 border-black d-inline px-3 py-1 placeholder w-50">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
            </Col>
            <Col xs={ 12 } className="text-center pb-2 px-0">
                <p className="placeholder w-75 p-2">&nbsp;</p>
            </Col>
        </Row>
    </Container>
);

export default function TicketsView(): JSX.Element {
    const { t } = useTranslation();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const location = useLocation();

    useEffect(() => {
        setTickets(location.state.tickets);
    }, [location]);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{ `${ t('my_tickets.page_title') } | ${ APP_NAME }` }</title>
                </Helmet>
            </HelmetProvider>

            <Carousel touch={ true } controls={ false } interval={ null }>
                {
                    tickets.length && tickets.map((t, idx) => <Carousel.Item key={ idx }>
                        <TicketView ticket={ t } />
                    </Carousel.Item>) || <Carousel.Item>
                        <TicketViewPlaceholder />
                    </Carousel.Item>
                }
            </Carousel>
        </>
    );
}
