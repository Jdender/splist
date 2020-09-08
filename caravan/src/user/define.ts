import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ObjectType, Field, InputType } from 'type-graphql';

@Entity()
@ObjectType()
export class User {
    @Field() @PrimaryColumn() id: string;
    @Field() @Column({ unique: true }) handle: string;

    @Column() password: string;
    @Column() salt: number;
}

@InputType()
export class LoginInput {
    @Field() handle: string;
    @Field() password: string;
}

@ObjectType()
export class AuthResult {
    @Field() token: string;
    @Field(() => User) user: User;
}
