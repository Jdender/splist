import { Column, Entity, PrimaryColumn } from 'typeorm';
import {
    ObjectType,
    Field,
    ID,
    InputType,
    createUnionType,
} from 'type-graphql';
import { Class } from '../util';
import { Length } from 'class-validator';

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

@ObjectType()
export class AuthPayload extends Class {
    @Field()
    public token: string;

    @Field(() => User)
    public user: User;
}

//#region Signup
@InputType()
export class SignupInput extends Class {
    @Field()
    @Length(2, 30)
    public handle: string;

    @Field()
    @Length(8, 128)
    public password: string;
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
//#endregion

//#region Login
@InputType()
export class LoginInput extends Class {
    @Field()
    @Length(2, 30)
    public handle: string;

    @Field()
    @Length(8, 128)
    public password: string;
}

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
//#endregion
