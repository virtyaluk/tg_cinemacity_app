/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import lodash from 'lodash';
import { Invoice, TakenSeat, BookingData } from '../models/services/db.js';
import { Ticket } from '../models/services/booking.js';

const __dirname: string = dirname(fileURLToPath(import.meta.url));
const file: string = join(__dirname, 'db.json');

type DbData = {
    invoices: Invoice[];
    taken_seats: TakenSeat[];
    booking_data: BookingData[];
    tickets: Ticket[];
}

class LowWithLodash<T> extends Low<T> {
    chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data');
}

const defaultData: DbData = {
    invoices: [],
    taken_seats: [],
    booking_data: [],
    tickets: [{
        owner_id: -1,
        title: 'Barbie',
        poster_path: '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        runtime: 136,
        code: 'shtepan.com',
        seats: [{ row: 6, seat: 4 }],
        date: 1697090400,
        time: {
            hour: 11,
            minute: 30,
        },
    }, {
        owner_id: -1,
        title: 'Saw X',
        poster_path: '/aQPeznSu7XDTrrdCtT5eLiu52Yu.jpg',
        runtime: 90,
        code: 'shtepan.com',
        seats: [{ row: 6, seat: 4 }, { row: 6, seat: 5 }],
        date: 1696771800,
        time: {
            hour: 9,
            minute: 0,
        },
    }, {
        owner_id: -1,
        title: 'John Wick: Chapter 4',
        poster_path: '/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
        runtime: 118,
        code: 'shtepan.com',
        seats: [{ row: 6, seat: 3 }, { row: 6, seat: 4 }, { row: 6, seat: 5 }],
        date: 1698252300,
        time: {
            hour: 18,
            minute: 45,
        },
    }],
};
const adapter: JSONFile<DbData> = new JSONFile<DbData>(file);
const db: LowWithLodash<DbData> = new LowWithLodash(adapter, defaultData);

await db.read();

export default db;
