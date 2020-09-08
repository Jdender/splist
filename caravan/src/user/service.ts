import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, LoginInput, AuthResult } from './define';
import { hash } from 'bcryptjs';
import cuid from 'cuid';
import { sign } from 'jsonwebtoken';

const TOKEN_SECRET = 'TEMP_DEBUG_SECRET_PLEASE_CHANGE';

@Service()
export class UserService {
    @InjectRepository(User)
    private repo: Repository<User>;

    public async signup(input: LoginInput): Promise<AuthResult> {
        const salt = 123;
        const password = await hash(input.password, salt);

        const user = this.repo.create({
            id: cuid(),
            handle: input.handle,
            password,
            salt,
        });
        await this.repo.save(user);

        const token = sign({}, TOKEN_SECRET, {
            subject: user.id,
        });

        return {
            token,
            user,
        };
    }
}
