import { render } from 'react-dom';
import React, { FC } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useGetHelloQuery } from '../generated/graphql';
import { createClient, TOKEN, useLocalStorage } from './util';
import { Provider } from 'jotai';
import { BrowserRouter } from 'react-router-dom';

const Test: FC = () => {
    const { data, loading, error } = useGetHelloQuery();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error + ''}</p>;
    if (!data) return <p>No data</p>;

    return <h1>Hello {data.hello}</h1>;
};

interface LoginProps {
    setToken: (arg: string) => void;
}

const Login: FC<LoginProps> = ({ setToken }) => {
    return (
        <>
            <h1>Not Logged In</h1>
            <button onClick={() => setToken(TOKEN)}>Login</button>
        </>
    );
};

const Index: FC = () => {
    const [token, setToken] = useLocalStorage('token', '');

    if (!token) {
        return <Login setToken={setToken} />;
    }

    const client = createClient(token);

    return (
        <Provider>
            <BrowserRouter>
                <ApolloProvider client={client}>
                    <Test />
                </ApolloProvider>
            </BrowserRouter>
        </Provider>
    );
};

render(<Index />, document.getElementById('app'));
