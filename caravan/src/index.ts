import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { Container } from 'typedi';
import { TestResolver } from './test';
import { createConnection, useContainer as typeormContainer } from 'typeorm';
import path = require('path');
import { UserResolver, User } from './user';

typeormContainer(Container);

async function main() {
    await createConnection({
        entities: [User],
        type: 'sqlite',
        database: path.join(__dirname, '/../.data/db.sqlite'),
        synchronize: true,
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
