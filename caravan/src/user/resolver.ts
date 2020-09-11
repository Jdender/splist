import { Service, Inject } from 'typedi';
import { Resolver, Mutation, Query } from 'type-graphql';
import { AuthPayload, User } from './define';
import { UserService } from './service';

@Service()
@Resolver()
export class UserResolver {
    @Inject()
    private service: UserService;

    @Mutation(() => AuthPayload)
    public signup() {
        return this.service.createUser();
    }

    @Query(() => [User])
    public users() {
        return this.service.fetchAllUsers();
    }
}
