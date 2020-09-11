import { render } from 'react-dom';
import React, { FC } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { useGetHelloQuery } from '../generated/graphql';
import { atom, Provider, useAtom } from 'jotai';

interface AuthPair {
    uri: string;
    token: string;
}

const authAtom = atom<AuthPair | null, AuthPair | null>(
    (_get) => {
        const item = localStorage.getItem('auth');
        if (item) return JSON.parse(item);
        else return null;
    },
    (_get, _set, auth) => {
        console.log({ auth });
        if (auth == null) localStorage.removeItem('auth');
        else localStorage.setItem('auth', JSON.stringify(auth));
    },
);

const clientAtom = atom((get) => {
    const auth = get(authAtom);

    if (auth == null) return null;
    console.log(auth);

    const link = new WebSocketLink({
        uri: auth.uri,
        options: {
            connectionParams: {
                Authorization: `Bearer ${auth.token}`,
            },
        },
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link,
    });
});

const Test: FC = () => {
    const { data, loading, error } = useGetHelloQuery();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error + ''}</p>;
    if (!data) return <p>No data</p>;

    return <h1>Hello {data.hello}</h1>;
};

const Index: FC = () => {
    const [client] = useAtom(clientAtom);
    const [, setAuth] = useAtom(authAtom);

    if (client == null) {
        setAuth({
            uri: 'ws://localhost:4000/graphql',
            token:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTk3OTI4MDAsInN1YiI6ImNrZXhuYnNuMjAwMDAyYnhrNnhwdDkzdHYifQ.Muj0q3TbW3nfz5R1w1LkC1mSZwkvdbPrlCf5kUVwIhI',
        });
        return <h1>No auth</h1>;
    }

    return (
        <ApolloProvider client={client}>
            <Test />
        </ApolloProvider>
    );
};

render(
    <Provider>
        <Index />
    </Provider>,
    document.getElementById('app'),
);
