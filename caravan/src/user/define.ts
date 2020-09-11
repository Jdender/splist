import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ObjectType, Field, InputType, createUnionType } from 'type-graphql';
import { CLASS } from '../util';

@Entity()
@ObjectType()
export class User {
    [CLASS] = true;

    @Field()
    @PrimaryColumn()
    public id: string;

    @Field()
    @Column({ unique: true })
    public handle: string;
}

@InputType()
export class SignupInput {
    [CLASS] = true;

    @Field()
    public handle: string;
}

@ObjectType()
export class AuthPayload {
    [CLASS] = true;

    @Field()
    public token: string;

    @Field(() => User)
    public user: User;
}

@ObjectType()
export class HandleTakenError {
    [CLASS] = true;

    @Field()
    public handle: string;
}

export type AuthResult = typeof AuthResult;
export const AuthResult = createUnionType({
    name: 'AuthResult',
    types: () => [AuthPayload, HandleTakenError] as const,
});
