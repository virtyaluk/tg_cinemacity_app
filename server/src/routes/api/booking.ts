/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import { Router, Request, Response } from 'express';
import { createInvoice } from '../../services/booking.js';
import { createInvoiceLink } from '../../services/tgbot.js';
import { CreateInvoiceRequestBody, CreateInvoiceResponse, ErrorResponse } from '../../../../shared';

const bookingRouter = Router();

// api/booking/invoice
bookingRouter.post('/invoice', async (
    req: Request<{}, {}, CreateInvoiceRequestBody>,
    res: Response<CreateInvoiceResponse | ErrorResponse>,
) => {
    try {
        const rb = req.body;
        const invoiceData = await createInvoice(rb.owner_id, rb.movie_id, rb.date, rb.time, rb.seats_taken, rb.lang);
        const invoice_url = await createInvoiceLink(invoiceData);

        res.json({
            invoice_url,
        });
    } catch (ex) {
        res.status(500).json({ message: 'Internal server error.' });
        console.error('api/booking/invoice ERROR: ', ex);
    }
});

export default bookingRouter;
