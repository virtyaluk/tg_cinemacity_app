/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row, ToggleButton } from 'react-bootstrap';
import autoAnimate from '@formkit/auto-animate';
import { getMovieSchedule, getTakenSeats } from '../api';
import { useSet } from '../hooks/useset';
import appController from '../services/AppController';
import { ErrorIcon } from '../components';
import { APP_NAME } from '../consts';
import { MovieScheduleResponse, MovieShowTimeSlot, CinemaHallSchema } from '../../../shared';
import './MovieBookingView.scss';

const ChairIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.88633 18H16.5332C17.1502 18 17.4587 18 17.7354 17.9611C18.8608 17.8028 19.8348 17.1756 20.3588 16.2717C20.4876 16.0494 20.5852 15.7879 20.7803 15.2649L21.8997 12.2643C22.3153 11.1504 21.3873 10 20.0731 10C19.2628 10 18.5392 10.4533 18.263 11.1339L17.2623 13.6C17.0683 14.078 16.9713 14.317 16.787 14.4835C16.6864 14.5744 16.5683 14.6484 16.4383 14.7019C16.2004 14.8 15.9158 14.8 15.3467 14.8H8.36757C8.07437 14.8 7.92777 14.8 7.79716 14.7735C7.49217 14.7116 7.22656 14.5452 7.05744 14.3101C6.98502 14.2094 6.93505 14.0863 6.83511 13.84L5.73699 11.1339C5.46079 10.4533 4.7372 10 3.92689 10C2.61268 10 1.68469 11.1504 2.10028 12.2643L3.40329 15.757C3.42288 15.8095 3.43267 15.8357 3.44197 15.8594C3.93869 17.1243 5.26517 17.9786 6.76531 17.9996C6.7934 18 6.82438 18 6.88633 18Z"
            stroke="#1C274C" strokeWidth="1.5" />
        <path
            d="M6 12V8.57143C6 6.41644 6 5.33894 6.70294 4.66947C7.40589 4 8.53726 4 10.8 4H13.2C15.4627 4 16.5941 4 17.2971 4.66947C18 5.33894 18 6.41644 18 8.57143V12"
            stroke="#1C274C" strokeWidth="1.5" />
        <path d="M18 20V18M6 20V18.6667" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const VIPChairIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.82143 21H17.1786C18.1745 21 18.6725 21 19.0845 20.8997C20.4888 20.5578 21.5854 19.3881 21.906 17.8901C22 17.4507 22 16.9195 22 15.8571V11.2456C22 10.0054 21.0574 9 19.8947 9C18.732 9 17.7895 10.0054 17.7895 11.2456V16.3333H6.21053V11.2456C6.21053 10.0054 5.26797 9 4.10526 9C2.94256 9 2 10.0054 2 11.2456V15.8571C2 16.9195 2 17.4507 2.09402 17.8901C2.41456 19.3881 3.51119 20.5578 4.91555 20.8997C5.32748 21 5.82546 21 6.82143 21Z"
            stroke="#1C274C" strokeWidth="1.5" strokeLinejoin="round" />
        <path
            d="M6 10V8.15385C6 5.85325 6 4.70296 6.48231 3.84615C6.79827 3.28485 7.25273 2.81874 7.8 2.49468C8.63538 2 9.75692 2 12 2C14.2431 2 15.3646 2 16.2 2.49468C16.7473 2.81874 17.2017 3.28485 17.5177 3.84615C18 4.70296 18 5.85325 18 8.15385V10"
            stroke="#1C274C" strokeWidth="1.5" />
        <path d="M19 22V21M4 22V21" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

interface CinemaHallSchemaProps {
    hall_schema: CinemaHallSchema;
    selectedSeats: Set<string>;
    takenSeats: Set<string>;
    onSeatClick: (row: number, seat: number) => void;
}

const CinemaHallSchema = ({ hall_schema, selectedSeats, takenSeats, onSeatClick }: CinemaHallSchemaProps) => (
    <>
        {
            hall_schema.rows.map((row, idx1) =>
                <Col key={ idx1 } xs={ 12 } className="text-center">
                    <div className="seat-row py-1">
                        {
                            row.seats.map(({ type, num, row }, idx2) =>
                                <ToggleButton variant={ '' }
                                              onClick={ () => onSeatClick(row, num) }
                                              key={ idx2 }
                                              className="p-0 mx-1 my-1" tabIndex={ -1 }
                                              type={ 'checkbox' }
                                              disabled={ takenSeats.has(`${ row }_${ num }`) }
                                              checked={ selectedSeats.has(`${ row }_${ num }`) }
                                              id={ `${ row }_${ num }` }
                                              value={ `${ row }_${ num }` }>
                                    {
                                        type == 0 && <ChairIcon /> || <VIPChairIcon />
                                    }
                                </ToggleButton>,
                            )
                        }
                    </div>
                </Col>,
            )
        }
    </>
);

const CinemaHallSchemaPreloader = () => (
    <>
        {
            [...new Array(7)].map((_, idx) =>
                <Col key={ idx } xs={ 12 } className="text-center placeholder-glow my-2">
                    <div className="seat-row w-75 py-2 placeholder placeholder-lg">
                    </div>
                </Col>,
            )
        }
    </>
);

interface DatePickerProps {
    selectedDate: number;
    setSelectedDate: (date: number) => void;
}

const DatePicker = ({ selectedDate, setSelectedDate }: DatePickerProps) => {
    const [dates, setDates] = useState<Date[]>([]);

    useEffect(() => {
        let newDates = [new Date(Date.now())];

        while (true) {
            const lastDate = newDates[newDates.length - 1],
                newDate = new Date(lastDate.getTime() + 86400000);

            if (newDate.getDay() == 4) {
                break;
            }

            newDates.push(newDate);
        }

        setDates(newDates);
    }, []);

    return (
        <>
            {
                dates.map((date, idx) => <ToggleButton id={ 'select_date' + date.getTime() } value={ date.getTime() }
                                                       key={ idx } type="radio"
                                                       onClick={ () => setSelectedDate(date.getTime()) }
                                                       checked={ selectedDate == date.getTime() }
                                                       variant="" className="m-0 p-0 d-inline-block">
                    <div className="date-item d-inline-block bg-body-secondary rounded-5 text-center me-3">
                        <p className="mb-0 pt-3 pb-1 text-uppercase">
                            {
                                date.toLocaleString('en-US', { weekday: 'short' })
                            }
                        </p>
                        <div
                            className="date-item-circle bg-white rounded-5 fs-5 m-1 d-flex align-items-center justify-content-center">
                            <span className="fs-6 fw-medium">
                                {
                                    date.getDate()
                                }
                            </span>
                        </div>
                    </div>
                </ToggleButton>)
            }
        </>
    );
};

interface TimePickerProps {
    selectedTime: string;
    setSelectedTime: (time: string) => void;
    showtime_slots: MovieShowTimeSlot[];
    selectedDate: number;
}

const TimePicker = ({ showtime_slots, selectedTime, setSelectedTime, selectedDate }: TimePickerProps) => {
    const sd = new Date(selectedDate),
        today = new Date(Date.now()),
        filterFn = ({ hour, minute }: MovieShowTimeSlot) => {
            if (sd.toLocaleDateString() == today.toLocaleDateString()) {
                return hour > today.getHours() || (hour === today.getHours() && minute > today.getMinutes());
            }

            return true;
        };

    return (
        <div>
            {
                showtime_slots.filter(filterFn).map(({ hour, minute }, idx) => <ToggleButton
                    key={ idx }
                    id={ `${ hour }_${ minute }` }
                    value={ `${ hour }_${ minute }` }
                    checked={ selectedTime == `${ hour }_${ minute }` }
                    onClick={ () => setSelectedTime(`${ hour }_${ minute }`) }
                    type="radio" variant=""
                    className="m-0 p-0">
                    <div
                        className="d-inline-block bg-body-secondary px-3 py-1 fs-6 fst-normal rounded-3 me-2">
                        { hour }:{ minute.toString().padEnd(2, '0') }
                    </div>

                </ToggleButton>)
            }
        </div>
    );
};

const TimePickerPlaceholder = () => (
    <div className="placeholder-glow">
        <div className="d-inline-block placeholder w-25 px-3 py-3 rounded-3 me-2" />
        <div className="d-inline-block placeholder w-25 px-3 py-3 rounded-3 me-2" />
        <div className="d-inline-block placeholder w-25 px-3 py-3 rounded-3 me-2" />
    </div>
);

export default function MovieBookingView() {
    const { movieId } = useParams();
    const { t } = useTranslation();
    const [movieSchedule, setMovieSchedule] = useState<MovieScheduleResponse>();
    const [appError, setAppError] = useState<boolean>(false);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<number>(0);
    const selectedSeats = useSet<string>([]);
    const takenSeats = useSet<string>([]);
    const parent1 = useRef(null);
    const parent2 = useRef(null);

    const navigationThroughBookingHandler = () => {
        console.log('process to booking');
    };

    const updateMainBtnStatus = () => {
        if (selectedSeats.size > 0) {
            let totalPrice = 0;

            selectedSeats.forEach((key) => {
                const [row, seat] = key.split('_'),
                    type = movieSchedule?.hall_schema.rows[parseInt(row)].seats[parseInt(seat)].type ?? 0;

                totalPrice += movieSchedule?.ticket_prices.prices[type] ?? 0;
            });

            appController.mainButton?.setDisability(!selectedDate || !selectedTime).setText(t('booking.main_btn_title', {
                amount: totalPrice / 100,
            })).show();
        } else {
            appController.mainButton?.disable().hide();
        }
    };

    const onSeatClick = (rowId: number, seatId: number) => {
        const key: string = `${ rowId }_${ seatId }`;

        if (selectedSeats.has(key)) {
            selectedSeats.delete(key);
        } else {
            selectedSeats.add(key);
        }

        updateMainBtnStatus();
    };

    // Used to fetch current hall schema, prices and time slots.
    useEffect(() => {
        getMovieSchedule(movieId ?? '0')
            .then(msr => {
                setMovieSchedule(msr);
            })
            .catch(err => {
                setAppError(true);
                console.error('an error occurred while loading now playing movies', err);
            });

        appController.mainButton?.on(navigationThroughBookingHandler);

        return () => {
            appController.mainButton?.off();
        };
    }, []);

    // Used to fetch taken seats API whenever `selectedDate` or `selectedTime` changes.
    useEffect(() => {
        updateMainBtnStatus();

        if (!selectedDate || !selectedTime) {
            return;
        }

        const selectedDt = new Date(selectedDate),
            showId = `${ selectedDt.getDate() }_${ selectedDt.getMonth() }_${ selectedTime }`;

        getTakenSeats(movieId ?? '0', showId)
            .then(sts => {
                takenSeats.clear();
                sts.taken_seats.forEach(({ row, seat }) => {
                    takenSeats.add(`${ row }_${ seat }`);
                });
            })
            .catch(err => {
                setAppError(true);
                console.error('an error occurred while fetching taken seats', err);
            });
    }, [selectedDate, selectedTime]);

    useEffect(() => {
        parent1.current && autoAnimate(parent1.current);
        parent2.current && autoAnimate(parent2.current);
    }, [parent1, parent2]);

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
                        <div className="px-4 screen-block">
                            <svg viewBox="0 0 300 76" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M 52.76 177.311 C 52.76 60.478 147.92 -34.464 264.749 -34.464 L 261.161 -30.942 C 154.205 -30.942 56.211 67.051 56.211 174.01 L 52.76 177.311 Z"
                                    style={ {
                                        transformOrigin: '159px 72px',
                                    } }
                                    transform="matrix(0.7, 0.7, -0.7, 0.7, -8.9, 3.7)" />
                            </svg>
                        </div>
                    </Col>
                </Row>
                <div className="row" ref={ parent1 }>
                    {
                        movieSchedule &&
                        <CinemaHallSchema hall_schema={ movieSchedule.hall_schema } selectedSeats={ selectedSeats }
                                          takenSeats={ takenSeats } onSeatClick={ onSeatClick } /> ||
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
            <Container className="bg-white pt-3 mt-3 rounded-5">
                <Row>
                    <Col xs={ 12 } className="text-center">
                        <h6 className="fw-medium">{ t('booking.dat_section_header') }</h6>
                    </Col>
                </Row>

                <Row>
                    <Col xs={ 12 }>
                        <div className="aval-dates-list overflow-x-scroll overflow-y-hidden pt-2 pb-2 text-center">
                            <div>
                                <DatePicker setSelectedDate={ setSelectedDate } selectedDate={ selectedDate } />
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
                        <p className="schedule-note mb-0 text-muted fw-normal pt-1 pb-3">
                            { t('booking.schedule_note') }
                        </p>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
