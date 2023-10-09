import { Router } from 'express'
import movieRouter from './movie.js';

const apiRouter = Router();

apiRouter.use('/movie', movieRouter);

export default apiRouter;
