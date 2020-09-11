import { Entity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Class } from '../util';

@Entity()
@ObjectType()
export class User extends Class {
    @Field(() => ID)
    @PrimaryColumn()
    public id: string;
}

@ObjectType()
export class AuthPayload extends Class {
    @Field()
    public token: string;

    @Field(() => User)
    public user: User;
}
