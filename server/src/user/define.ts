import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
    ObjectType,
    Field,
    ID,
    InputType,
    createUnionType,
} from 'type-graphql';
import { Class } from '../util';

@Entity()
@ObjectType()
export class User extends Class {
    @Field(() => ID)
    @PrimaryColumn()
    public id: string;

    @Field()
    @Column()
    public handle: string;

    @Column()
    public password: string;
}

@InputType()
export class AuthInput extends Class {
    @Field()
    public handle: string;
    @Field()
    public password: string;
}

@ObjectType()
export class AuthPayload extends Class {
    @Field()
    public token: string;

    @Field(() => User)
    public user: User;
}

@ObjectType()
export class HandleAlreadyTakenError extends Class {
    @Field()
    public handle: string;
}

export type SignupResult = typeof SignupResult;
export const SignupResult = createUnionType({
    name: 'SignResult',
    types: () => [AuthPayload, HandleAlreadyTakenError] as const,
});

@ObjectType()
export class InvalidHandleOrPasswordError extends Class {
    @Field()
    public handle: string;

    @Field()
    public password: string;
}

export type LoginResult = typeof LoginResult;
export const LoginResult = createUnionType({
    name: 'LoginResult',
    types: () => [AuthPayload, InvalidHandleOrPasswordError] as const,
});
