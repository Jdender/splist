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
    Authorized,
} from 'type-graphql';

const PING_PONG_TOPIC = 'PING_PONG';

@Service()
@Resolver()
export class TestResolver {
    @Authorized()
    @Query(() => String)
    public hello() {
        return 'world!';
    }

    @Authorized()
    @Mutation(() => String)
    public ping(
        @Arg('message') message: string,
        @PubSub(PING_PONG_TOPIC) publish: Publisher<string>,
    ) {
        publish(message);
        return message;
    }

    @Authorized()
    @Subscription(() => String, {
        topics: PING_PONG_TOPIC,
    })
    public pong(@Root() message: string) {
        return message;
    }
}
