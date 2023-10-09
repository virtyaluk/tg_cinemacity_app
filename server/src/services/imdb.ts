/*
 * Licensed under the MIT license.
 * Copyright (c) 2023 Bohdan Shtepan <bohdan@shtepan.com>
 */


import fetch, { Response } from 'node-fetch';
import { MovieInfo } from '../models/services/imdb';

export async function getInfo(id: string): Promise<MovieInfo> {
    const resp: Response = await fetch(
        'https://www.imdb.com/title/' + id,
        {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            },
        },
    );
    const body: string = await resp.text();
    const json = body.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
    const movieInfo = JSON.parse(json && json[1] || '{}');

    return {
        content_rating: 'contentRating' in movieInfo && movieInfo['contentRating'] || '',
        rating: 'aggregateRating' in movieInfo && movieInfo['aggregateRating']['ratingValue'] || -1,
        rating_count: 'aggregateRating' in movieInfo && movieInfo['aggregateRating']['ratingCount'] || -1,
        directors: 'director' in movieInfo && movieInfo['director'].map((dir: object) => {
            return 'name' in dir && dir['name'] || '';
        }).filter((name: any) => name) || [],
    };
}