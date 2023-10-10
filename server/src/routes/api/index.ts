/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import { Router } from 'express'
import movieRouter from './movie.js';
import bookingRouter from './booking.js';

const apiRouter = Router();

apiRouter.use('/movie', movieRouter);
apiRouter.use('/booking', bookingRouter);

export default apiRouter;
