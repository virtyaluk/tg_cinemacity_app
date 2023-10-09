/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


export const developmentConfig = {
 port: 4000,
 httpsPort: 443,
 allowedOrigin: 'http://localhost:8080'
}

export const productionConfig = {
 port: 80,
 httpsPort: 443,
 allowedOrigin: 'http://localhost:80'
}
