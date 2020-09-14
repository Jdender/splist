import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User, AuthPayload } from './define';
import cuid from 'cuid';
import { sign, verify } from 'jsonwebtoken';
import { TOKEN_SECRET, build } from '../util';

@Service()
export class UserService {
    @InjectRepository(User)
    private repo: Repository<User>;

    public async createUser(): Promise<AuthPayload> {
        const user = await this.repo.save({
            id: cuid(),
        });

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
