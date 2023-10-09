/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import 'dotenv/config';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { developmentConfig, productionConfig } from './config/index.js';
import apiRouter from './routes/api/index.js';
import onError from './utils/onError.js';
import http from 'http';
import https from 'https';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';

let config;
if (isProduction) {
    config = productionConfig;
} else {
    config = developmentConfig;
}

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(
    cors({
        origin: config.allowedOrigin,
    }),
);
app.use(json());
app.use(urlencoded({ extended: true }));

if (isProduction) {
    app.use(express.static(join(__dirname, '../../client/build')));
}

app.use('/api', apiRouter);
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' });
});
app.use(onError);

http.createServer(app).listen(config.port, () => {
    console.log('🚀 HTTP server ready to handle requests');
});

if (isProduction) {
    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/lab.modern-dev.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/lab.modern-dev.com/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/lab.modern-dev.com/chain.pem'),
    };

    https.createServer(options, app).listen(config.httpsPort, () => {
        console.log('🚀 HTTPS server ready to handle requests');
    });
}
