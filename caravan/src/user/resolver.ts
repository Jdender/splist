import { Service, Inject } from 'typedi';
import { Resolver, Mutation, Query } from 'type-graphql';
import { AuthResult, SignupInput, User } from './define';
import { UserService } from './service';
import { Input } from '../util';

@Service()
@Resolver()
export class UserResolver {
    @Inject()
    private service: UserService;

    @Mutation(() => AuthResult)
    public signup(@Input() signupInput: SignupInput) {
        return this.service.createUser(signupInput);
    }

    @Query(() => [User])
    public users() {
        return this.service.fetchAllUsers();
    }
}
