import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
    User,
    AuthPayload,
    SignupResult,
    LoginResult,
    AuthInput,
    HandleAlreadyTakenError,
    InvalidHandleOrPasswordError,
} from './define';
import cuid from 'cuid';
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { TOKEN_SECRET, build } from '../util';

@Service()
export class UserService {
    @InjectRepository(User)
    private repo: Repository<User>;

    public async createUser({
        handle,
        password: rawPassword,
    }: AuthInput): Promise<SignupResult> {
        const id = cuid();

        const existing = await this.repo.findOne({
            where: [{ id }, { handle }],
        });

        if (existing) {
            console.log(existing);

            return build(HandleAlreadyTakenError, { handle });
        }

        const password = await hash(rawPassword, 10);

        const user = await this.repo.save({
            id,
            handle,
            password,
        });

        const token = sign({}, TOKEN_SECRET, {
            subject: user.id,
        });

        return build(AuthPayload, {
            token,
            user,
        });
    }

    public async createTokenFromUser({
        handle,
        password,
    }: AuthInput): Promise<LoginResult> {
        const user = await this.repo.findOne({ where: { handle } });

        if (!user || !(await compare(password, user.password))) {
            return build(InvalidHandleOrPasswordError, {
                handle,
                password,
            });
        }

        const token = sign({}, TOKEN_SECRET, {
            subject: user.id,
        });

        return build(AuthPayload, {
            token,
            user,
        });
    }

    private verify(token: string) {
        try {
            const payload = verify(token, TOKEN_SECRET);
            if (typeof payload !== 'object') return;
            return payload;
        } catch {
            return;
        }
    }

    public async getUserFromToken(token: string): Promise<User | undefined> {
        const payload = this.verify(token) as { subject: string | undefined };
        return this.repo.findOne(payload?.subject);
    }

    public fetchAllUsers(): Promise<User[]> {
        return this.repo.find();
    }
}
