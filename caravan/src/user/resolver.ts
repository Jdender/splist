import { Service } from 'typedi';
import { Resolver } from 'type-graphql';

@Service()
@Resolver()
export class UserResolver {}
