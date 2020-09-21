import { Service, Inject } from 'typedi';
import { Resolver, Mutation, Query } from 'type-graphql';
import { AuthInput, LoginResult, SignupResult, User } from './define';
import { UserService } from './service';
import { Input } from '../util';

@Service()
@Resolver()
export class UserResolver {
    @Inject()
    private service: UserService;

    @Mutation(() => SignupResult)
    public signup(@Input() input: AuthInput) {
        return this.service.createUser(input);
    }

    @Mutation(() => LoginResult)
    public login(@Input() input: AuthInput) {
        return this.service.createTokenFromUser(input);
    }

    @Query(() => [User])
    public users() {
        return this.service.fetchAllUsers();
    }
}
