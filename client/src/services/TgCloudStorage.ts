/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */

import { Telegram } from '../../../shared';

const telegramWindow = window as unknown as Window & { Telegram: Telegram };
const CloudStorage = telegramWindow.Telegram.WebApp.CloudStorage;

//
// interface KeyValuePair {
//     [key: string]: string;
// }

export const setItem = (key: string, val: string): Promise<boolean | null> =>
    new Promise((resolve, reject) => {
            CloudStorage.setItem(key, val, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result ?? null);
                }
            });
        },
    );

export const getItem = (key: string): Promise<string | null> =>
    new Promise((resolve, reject) => {
            CloudStorage.getItem(key, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result ?? null);
                }
            });
        },
    );

// export const getItems = (keys: string[]): Promise<KeyValuePair | undefined> =>
//     new Promise((resolve, reject) =>
//         WebApp.CloudStorage.getItems(keys, (error, result) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     );
//
// export const removeItem = (key: string): Promise<boolean | undefined> =>
//     new Promise((resolve, reject) =>
//         WebApp.CloudStorage.removeItem(key, (error, result) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     );
//
// export const removeItems = (keys: string[]): Promise<boolean | undefined> =>
//     new Promise((resolve, reject) =>
//         WebApp.CloudStorage.removeItems(keys, (error, result) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     );
//
// export const getKeys = (): Promise<string[] | undefined> =>
//     new Promise((resolve, reject) =>
//         WebApp.CloudStorage.getKeys((error, result) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     );
