import { render } from 'react-dom';
import React, { FC } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { useGetHelloQuery } from '../generated/graphql';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

const Test: FC = () => {
    const { data, loading, error } = useGetHelloQuery();

    if (!data || loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return <h1>Hello {data.hello}</h1>;
};

const Index: FC = () => (
    <ApolloProvider client={client}>
        <Test />
    </ApolloProvider>
);

render(<Index />, document.getElementById('app'));
