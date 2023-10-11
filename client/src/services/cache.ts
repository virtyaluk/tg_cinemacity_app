import localforage from 'localforage';

interface CacheFrame<T> {
    data: T;
    create_at: number;
}

export async function cachingFetch<T>(input: RequestInfo | URL, init?: RequestInit, ttl: number = 0): Promise<T> {
    let cachingKey: string;

    if (input && input instanceof Request) {
        cachingKey = input.url;
    } else {
        cachingKey = String(input);
    }

    if (ttl == 0) {
        return await fetch(input, init).then(async (resp) => await resp.json() as T);
    }

    return await localforage
        .getItem<CacheFrame<T>>(cachingKey)
        .then(async (value) => {
            if (value && (Date.now() - value.create_at) < ttl * 1000) {
                return value.data;
            }

            return await fetch(input, init);
        })
        .then(async (res) => {
            if (res instanceof Response) {
                return await res.json() as T;
            }

            return res;
        })
        .then(async (data) => {
            return localforage.setItem<CacheFrame<T>>(cachingKey, {
                data,
                create_at: Date.now(),
            });
        })
        .then(frame => {
            return frame.data;
        });
}
