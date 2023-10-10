/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import 'dotenv/config';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import { developmentConfig, productionConfig } from './config/index.js';
import apiRouter from './routes/api/index.js';
import tgBot from './services/tgbot.js';
import onError from './utils/onError.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const options = {
    key: fs.readFileSync(join(__dirname, '../certs/key.pem')),
    cert: fs.readFileSync(join(__dirname, '../certs/cert.pem')),
};
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

app.use(tgBot.webhookCallback('/tgbot'));
app.use('/api', apiRouter);
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' });
});
app.use(onError);

app.post(`/tgbot`, (req, res) => {
    return tgBot.handleUpdate(req.body, res);
});

http.createServer(app).listen(config.port, () => {
    console.log('🚀 HTTP server ready to handle requests');
});

https.createServer(options, app).listen(config.httpsPort, () => {
    console.log('🚀 HTTPS server ready to handle requests');
});
