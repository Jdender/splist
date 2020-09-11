import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import {
    User,
    SignupInput,
    AuthResult,
    HandleTakenError,
    AuthPayload,
} from './define';
import cuid from 'cuid';
import { sign } from 'jsonwebtoken';
import { TOKEN_SECRET, build } from '../util';

@Service()
export class UserService {
    @InjectRepository(User)
    private repo: Repository<User>;

    public async createUser({ handle }: SignupInput): Promise<AuthResult> {
        const existingUser = await this.repo.findOne({ where: { handle } });

        if (existingUser) {
            return build(HandleTakenError, { handle });
        }

        const user = await this.repo.save({
            id: cuid(),
            handle,
        });

        const token = sign({}, TOKEN_SECRET, {
            subject: user.id,
        });

        return build(AuthPayload, {
            token,
            user,
        });
    }

    public fetchAllUsers(): Promise<User[]> {
        return this.repo.find();
    }
}
