import { useState } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';

export const TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTk3OTI4MDAsInN1YiI6ImNrZXhuYnNuMjAwMDAyYnhrNnhwdDkzdHYifQ.Muj0q3TbW3nfz5R1w1LkC1mSZwkvdbPrlCf5kUVwIhI';

export const createClient = (token: string) => {
    const link = new WebSocketLink({
        uri: 'ws://localhost:4000/graphql',
        options: {
            connectionParams: {
                Authorization: `Bearer ${token}`,
            },
        },
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link,
    });
};

export const useLocalStorage = <T>(key: string, initial: T) => {
    const [stored, setStored] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initial;
        } catch (e) {
            console.error(e);
            return initial;
        }
    });

    const set = (value: T) => {
        setStored(value);
        localStorage.setItem(key, JSON.stringify(value));
    };

    return [stored, set] as const;
};
