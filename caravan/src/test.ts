import { Service } from 'typedi';
import {
    Resolver,
    Query,
    Subscription,
    Root,
    Mutation,
    Arg,
    PubSub,
    Publisher,
} from 'type-graphql';

const PING_PONG_TOPIC = 'PING_PONG';

@Service()
@Resolver()
export class TestResolver {
    @Query(() => String)
    hello() {
        return 'world!';
    }

    @Mutation(() => String)
    ping(
        @Arg('message') message: string,
        @PubSub(PING_PONG_TOPIC) publish: Publisher<string>,
    ) {
        publish(message);
        return message;
    }

    @Subscription(() => String, {
        topics: PING_PONG_TOPIC,
    })
    pong(@Root() message: string) {
        return message;
    }
}