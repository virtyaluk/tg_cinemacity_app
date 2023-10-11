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
    tickets: [],
};
const adapter: JSONFile<DbData> = new JSONFile<DbData>(file);
const db: LowWithLodash<DbData> = new LowWithLodash(adapter, defaultData);

await db.read();

export default db;
