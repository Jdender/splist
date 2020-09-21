import { render } from 'react-dom';
import React, { FC } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useGetHelloQuery } from '../generated/graphql';
import { createClient, storedAtom, TOKEN } from './util';
import { Provider, useAtom } from 'jotai';
import { BrowserRouter } from 'react-router-dom';

const Test: FC = () => {
    const { data, loading, error } = useGetHelloQuery();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error + ''}</p>;
    if (!data) return <p>No data</p>;

    return <h1>Hello {data.hello}</h1>;
};

const tokenAtom = storedAtom('token', '');

const Login: FC = () => {
    const [, setToken] = useAtom(tokenAtom);
    return (
        <>
            <h1>Not Logged In</h1>
            <button onClick={() => setToken(TOKEN)}>Login</button>
        </>
    );
};

const Index: FC = () => {
    const [token] = useAtom(tokenAtom);

    if (!token) {
        return <Login />;
    }

    const client = createClient(token);

    return (
        <ApolloProvider client={client}>
            <Test />
        </ApolloProvider>
    );
};

render(
    <Provider>
        <BrowserRouter>
            <Index />
        </BrowserRouter>
    </Provider>,
    document.getElementById('app'),
);
