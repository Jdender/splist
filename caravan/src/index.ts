import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { Container } from 'typedi';
import { TestResolver } from './test';
import { createConnection } from 'typeorm';
import path = require('path');
import { UserResolver } from './user';

async function main() {
    await createConnection({
        type: 'sqlite',
        database: path.join(__dirname, '/../.data/db.sqlite'),
    });

    const schema = await buildSchema({
        resolvers: [TestResolver, UserResolver],
        container: Container,
        emitSchemaFile: path.join(__dirname, '../schema.graphql'),
    });

    const server = new ApolloServer({
        schema,
    });

    const { url } = await server.listen();
    console.log(`🚀  Server ready at ${url}`);
}

main();
