/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-bootstrap';
import autoAnimate from '@formkit/auto-animate';
import { getMovieSchedule, getTakenSeats, createInvoice } from '../api';
import { useSet } from '../hooks/useset';
import app from '../services/AppController';
import { ErrorIcon, HallSchema, DatePicker, TimePicker } from '../components';
import { TimePickerPlaceholder, CinemaHallSchemaPreloader } from '../components/placeholders';
import { APP_NAME } from '../consts';
import { MovieScheduleResponse, TakenSeat, CinemaHallSeatSchema, MovieShowTimeSlot } from '../../../shared';
import './MovieBookingView.scss';

type TakenSeatKey = `${ string }_${ string }`;
type ShowId = `${ number }_${ number }_${ number }_${ number }_${ number }`;

const generateShowId = (selectedDate: number, selectedTime: MovieShowTimeSlot): ShowId => {
    const dt: Date = new Date(selectedDate);

    return `${ dt.getUTCDate() }_${ dt.getUTCMonth() }_${ dt.getUTCFullYear() }_${ selectedTime.hour }_${ selectedTime.minute }`;
};

const getTakenSeatKey = ({ row, seat }: TakenSeat): TakenSeatKey => `${ row }_${ seat }`;
const DEFAULT_SELECTED_TIME: MovieShowTimeSlot = { hour: -1, minute: -1 };
const DEFAULT_SELECTED_DATE: number = 0;

export default function MovieBookingView() {
    const { movieId } = useParams();
    const { t } = useTranslation();
    const [movieSchedule, setMovieSchedule] = useState<MovieScheduleResponse>();
    const [appError, setAppError] = useState<boolean>(false);
    const [dateSlots, setDateSlots] = useState<number[]>([]);
    const [selectedTime, setSelectedTime] = useState<MovieShowTimeSlot>(DEFAULT_SELECTED_TIME);
    const [selectedDate, setSelectedDate] = useState<number>(DEFAULT_SELECTED_DATE);
    const selectedSeats = useSet<CinemaHallSeatSchema>([]);
    const takenSeats = useSet<TakenSeatKey>([]);
    const parent1 = useRef(null);
    const parent2 = useRef(null);
    const onMainBtnClickHandler = () => {
        if (!selectedDate || selectedTime.hour == -1 || !selectedSeats.size) {
            return;
        }

        const seatsTaken: TakenSeat[] = [];

        selectedSeats.forEach(seat => {
            seatsTaken.push({
                row: seat.row,
                seat: seat.num,
            });
        });

        app.mainButton
            .disable()
            .showProgress();

        createInvoice({
            owner_id: app.getUserId(),
            movie_id: parseInt(movieId ?? '-1'),
            date: selectedDate,
            time: selectedTime,
            seats_taken: seatsTaken,
        })
            .then(res => {
                return app.openInvoice(res.invoice_url);
            })
            .then(status => {
                app.mainButton
                    .enable()
                    .hideProgress();

                if (status === 'paid' || status === 'pending') {
                    app.brr.notification('success');
                    app.close();
                }
            })
            .catch(err => {
                setAppError(true);
                app.mainButton
                    .enable()
                    .hideProgress();
                console.error('an error occurred while loading now playing movies', err);
            });
    };

    const updateAvailableDateSlots = () => {
        let newDatesSlots: number[] = [Date.now()];

        while (true) {
            const lastDateTs = newDatesSlots[newDatesSlots.length - 1],
                newDate = new Date(lastDateTs + 86400000);

            if (newDate.getDay() == 4) {
                break;
            }

            newDatesSlots.push(newDate.getTime());
        }

        setDateSlots(newDatesSlots);
        setSelectedDate(newDatesSlots[0]);
    };

    const removeSelectedSeatsThatAreTaken = () => {
        selectedSeats.forEach(seat => {
            if (takenSeats.has(`${ seat.row }_${ seat.num }`)) {
                selectedSeats.delete(seat);
            }
        });
    };

    // Used to fetch current hall schema, prices and time slots.
    useEffect(() => {
        getMovieSchedule(movieId ?? '0')
            .then(msr => {
                setMovieSchedule(msr);
                updateAvailableDateSlots();
                setAppError(false);
            })
            .catch(err => {
                setAppError(true);
                app.brr.notification('error');
                console.error('an error occurred while loading now playing movies', err);
            });
    }, []);

    useEffect(() => {
        parent1.current && autoAnimate(parent1.current);
        parent2.current && autoAnimate(parent2.current);
    }, [parent1, parent2]);

    useEffect(() => {
        app.backButton.show();
        app.mainButton.reset(false);

        return () => {
            app.backButton.hide();
            app.mainButton.hide();
        };
    }, []);

    // Fetch taken seats each time a selected time changes
    useEffect(() => {
        if (selectedTime == DEFAULT_SELECTED_TIME) {
            return;
        }

        const showId: ShowId = generateShowId(selectedDate, selectedTime);

        getTakenSeats(movieId ?? '0', showId)
            .then(sts => {
                takenSeats.clear();
                sts.taken_seats.forEach(seat => {
                    takenSeats.add(getTakenSeatKey(seat));
                });
                removeSelectedSeatsThatAreTaken();
            })
            .catch(err => {
                setAppError(true);
                app.brr.notification('error');
                console.error('an error occurred while fetching taken seats', err);
            });
    }, [selectedTime]);

    useEffect(() => {
        let totalPrice = 0;

        selectedSeats.forEach(({ row, num }) => {
            const seatType = movieSchedule?.hall_schema.rows[row].seats[num].type ?? 0;
            totalPrice += movieSchedule?.ticket_prices.prices[seatType] ?? 0;
        });

        app.mainButton
            .setVisibility(totalPrice > 0)
            .setDisability(selectedTime.minute == -1)
            .setText(t('booking.main_btn_title', {
                amount: totalPrice / 100,
            }))
            .on(onMainBtnClickHandler);
        app.closingConfirmation(totalPrice > 0 && selectedTime.minute != -1);

        return () => {
            app.mainButton.off(onMainBtnClickHandler);
            app.disableClosingConfirmation();
        };
    }, [selectedSeats.size, selectedDate, selectedTime]);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{ `${ t('booking.page_title') } | ${ APP_NAME }` }</title>
                </Helmet>
            </HelmetProvider>

            { appError && <ErrorIcon /> || <></> }

            <Container>
                <Row>
                    <Col xs={ 12 }>
                        <div className="px-4 screen-block position-relative">
                            <svg viewBox="0 0 300 76" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M 52.76 177.311 C 52.76 60.478 147.92 -34.464 264.749 -34.464 L 261.161 -30.942 C 154.205 -30.942 56.211 67.051 56.211 174.01 L 52.76 177.311 Z"
                                    style={ {
                                        transformOrigin: '159px 72px',
                                    } }
                                    transform="matrix(0.7, 0.7, -0.7, 0.7, -8.9, 3.7)" />
                            </svg>
                            <div
                                className="screen-label position-absolute text-center top-50 start-0 end-0 text-uppercase fw-normal">
                                { t('booking.screen_label') }
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="row" ref={ parent1 }>
                    {
                        movieSchedule &&
                        <HallSchema hall_schema={ movieSchedule.hall_schema } selectedSeats={ selectedSeats }
                                    takenSeats={ takenSeats } /> ||
                        <CinemaHallSchemaPreloader />
                    }
                </div>
                <Row className="pt-4 pb-2">
                    <Col xs={ 4 } className="text-center">
                        <div className="seat-avail-tick seat-tick-avail rounded-2 d-inline-block"></div>
                        <span className="align-bottom">&nbsp;&nbsp;{ t('booking.available_label') }</span>
                    </Col>
                    <Col xs={ 4 } className="text-center">
                        <div className="seat-avail-tick seat-tick-sel rounded-2 d-inline-block"></div>
                        <span className="align-bottom">&nbsp;&nbsp;{ t('booking.selected_label') }</span>
                    </Col>
                    <Col xs={ 4 } className="text-center">
                        <div className="seat-avail-tick seat-tick-res rounded-2 d-inline-block"></div>
                        <span className="align-bottom">&nbsp;&nbsp;{ t('booking.reserved_label') }</span>
                    </Col>
                </Row>
            </Container>
            <Container className="bg-white pt-3 mt-3 rounded-top-5">
                <Row>
                    <Col xs={ 12 } className="text-center">
                        <h6 className="fw-medium text-dark">{ t('booking.dat_section_header') }</h6>
                    </Col>
                </Row>

                <Row>
                    <Col xs={ 12 }>
                        <div className="aval-dates-list overflow-x-scroll overflow-y-hidden pt-2 pb-2 text-center">
                            <div>
                                <DatePicker selectedDate={ selectedDate } dateSlots={ dateSlots }
                                            setSelectedDate={ setSelectedDate } />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col xs={ 12 }>
                        <div className="aval-times-list overflow-x-scroll overflow-y-hidden pt-1 pb-3 text-center"
                             ref={ parent2 }>
                            {
                                movieSchedule &&
                                <TimePicker selectedTime={ selectedTime } setSelectedTime={ setSelectedTime }
                                            selectedDate={ selectedDate }
                                            showtime_slots={ movieSchedule.showtime_slots } /> ||
                                <TimePickerPlaceholder />
                            }
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col xs={ 12 } className="px-4">
                        <p className="schedule-note mb-0 text-muted fw-normal pt-1 pb-3 text-center">
                            { t('booking.schedule_note') }
                        </p>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
