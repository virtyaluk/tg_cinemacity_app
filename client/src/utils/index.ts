/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


export const getPoster = (posters: string[], idx: number): string => {
    const len = posters.length;

    while (idx >= len) {
        idx--;
    }

    return posters[idx];
};

export const timeout = (ms: number) => new Promise(resolve => setTimeout(() => resolve(true), ms));
