import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import { Container } from 'typedi';
import { TestResolver } from './test';
import { createConnection, useContainer as typeormContainer } from 'typeorm';
import path = require('path');
import { UserResolver, User } from './user';
import { UserService } from './user/service';
import { authChecker } from './util';

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
        authChecker,
        emitSchemaFile: path.join(__dirname, '../schema.graphql'),
    });

    const server = new ApolloServer({
        schema,
        context: async ({ req, connection }) => {
            const token = (
                req?.headers?.authorization ??
                connection?.context?.Authorization ??
                ''
            ).split(' ')[1];
            if (!token) return {};

            const user = await Container.get(UserService).getUserFromToken(
                token,
            );

            if (!user) throw new AuthenticationError('User no longer exists');

            return { user };
        },
    });

    const { url } = await server.listen();
    console.log(`🚀  Server ready at ${url}`);
}

main();
