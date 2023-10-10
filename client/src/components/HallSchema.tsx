/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import React from 'react';
import { Col, ToggleButton } from 'react-bootstrap';
import { ChairIcon, VIPChairIcon } from './';
import { CinemaHallSchema, CinemaHallSeatSchema } from '../../../shared';

type TakenSeatSchema = `${string}_${string}`;

interface HallSchemaProps {
    hall_schema: CinemaHallSchema;
    selectedSeats: Set<CinemaHallSeatSchema>;
    takenSeats: Set<TakenSeatSchema>;
}

export default function HallSchema({ hall_schema, selectedSeats, takenSeats }: HallSchemaProps) {
    const onSeatClick = (seat: CinemaHallSeatSchema): void => {
        if (selectedSeats.has(seat)) {
            selectedSeats.delete(seat);
        } else {
            selectedSeats.add(seat);
        }
    };

    const getSeatKey = (seat: CinemaHallSeatSchema): TakenSeatSchema => {
        return `${ seat.row }_${ seat.num }`;
    };

    return (
        <>
            {
                hall_schema.rows.map((row, idx1) =>
                    <Col key={ idx1 } xs={ 12 } className="text-center">
                        <div className="seat-row py-1">
                            {
                                row.seats.map((seat, idx2) =>
                                    <ToggleButton variant={ '' } key={ idx2 }
                                                  onClick={ () => onSeatClick(seat) }
                                                  className="p-0 mx-1 my-1" tabIndex={ -1 }
                                                  type={ 'checkbox' }
                                                  disabled={ takenSeats.has(getSeatKey(seat)) }
                                                  checked={ selectedSeats.has(seat) }
                                                  id={ getSeatKey(seat) }
                                                  value={ getSeatKey(seat) }>
                                        {
                                            seat.type == 0 && <ChairIcon /> || <VIPChairIcon />
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
}
