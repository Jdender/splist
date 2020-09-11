import { Arg, ClassType } from 'type-graphql';
import { plainToClass } from 'class-transformer';

export const build = <T extends Class>(
    cls: ClassType<T>,
    obj: Omit<T, typeof CLASS>,
) => plainToClass(cls, obj);

const CLASS = Symbol();

export abstract class Class {
    [CLASS] = CLASS;
}

export const Input = () => Arg('input');

export const TOKEN_SECRET = 'TEMP_DEBUG_SECRET_PLEASE_CHANGE';
