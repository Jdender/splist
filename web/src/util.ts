import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { atom } from 'jotai';

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

export const storedAtom = <T>(key: string, initial: T) => {
    const item = window.localStorage.getItem(key);
    const inner = atom(item ? JSON.parse(item) : initial);
    return atom<T, T>(
        (get) => get(inner),
        (_get, set, value) => {
            set(inner, value);
            localStorage.setItem(key, JSON.stringify(value));
        },
    );
};
