import { Telegram, WebApp as WebAppTypes } from '../../../shared';

const telegramWindow = window as unknown as Window & { Telegram: Telegram };
const WebApp: WebAppTypes = telegramWindow.Telegram.WebApp;

//
// interface KeyValuePair {
//     [key: string]: string;
// }

export const setItem = (key: string, val: string): Promise<boolean | null> =>
    new Promise((resolve, reject) =>
        WebApp.CloudStorage.setItem(key, val, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result ?? null);
            }
        })
    );

export const getItem = (key: string): Promise<string | null> =>
    new Promise((resolve, reject) =>
        WebApp.CloudStorage.getItem(key, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result ?? null);
            }
        })
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

export const foo = () => {};
