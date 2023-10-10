/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { ToggleButton } from 'react-bootstrap';

type TimestampAndDate = [number, Date];

interface DatePickerProps {
    selectedDate: number;
    setSelectedDate: (date: number) => void;
    dateSlots: number[];
}

const mapTsToTsAndDate = (ts: number): TimestampAndDate => ([ts, new Date(ts)]);

const DatePicker = ({ selectedDate, dateSlots, setSelectedDate }: DatePickerProps) => {
    return (
        <>
            {
                dateSlots.map(mapTsToTsAndDate).map(([ts, date]: TimestampAndDate, idx: number) => <ToggleButton
                    id={ 'select_date' + ts } value={ ts }
                    key={ idx } type="radio"
                    onClick={ () => {
                        setSelectedDate(ts);
                    } }
                    checked={ selectedDate == ts }
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

export default DatePicker;
