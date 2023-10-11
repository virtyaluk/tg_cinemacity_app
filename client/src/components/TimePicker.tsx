/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { ToggleButton } from 'react-bootstrap';
import { MovieShowTimeSlot } from '../../../shared';

type TimeSlotKey = `${ string }_${ string }`;

interface TimePickerProps {
    selectedTime: MovieShowTimeSlot;
    setSelectedTime: (timeSlot: MovieShowTimeSlot) => void;
    showtime_slots: MovieShowTimeSlot[];
    selectedDate: number;
}

const getTimeSlotKey = ({ hour, minute }: MovieShowTimeSlot): TimeSlotKey => `${ hour }_${ minute }`;

const TimePicker = ({ showtime_slots, selectedTime, setSelectedTime, selectedDate }: TimePickerProps) => {
    const sd: Date = new Date(selectedDate),
        today: Date = new Date(Date.now()),
        filterFn = ({ hour, minute }: MovieShowTimeSlot) => {
            if (sd.toLocaleDateString() == today.toLocaleDateString()) {
                return hour > today.getHours() || (hour === today.getHours() && minute > today.getMinutes());
            }

            return true;
        };

    return (
        <div>
            {
                showtime_slots.filter(filterFn).map((slot: MovieShowTimeSlot, idx: number) => <ToggleButton
                    key={ idx }
                    id={ getTimeSlotKey(slot) }
                    value={ getTimeSlotKey(slot) }
                    checked={ selectedTime == slot }
                    onClick={ () => setSelectedTime(slot) }
                    disabled={ !selectedDate }
                    type="radio" variant=""
                    className="m-0 p-0">
                    <div
                        className="time-item d-inline-block bg-body-secondary px-3 py-1 fs-6 fst-normal rounded-3 me-2">
                        { slot.hour }:{ slot.minute.toString().padEnd(2, '0') }
                    </div>

                </ToggleButton>)
            }
        </div>
    );
};

export default TimePicker;
