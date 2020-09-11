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

    public async getUserFromToken(token: string): Promise<User | undefined> {
        const payload = verify(token, TOKEN_SECRET);
        if (typeof payload !== 'object') return;

        const id = (payload as { subject: string | undefined })?.subject;
        return this.repo.findOne(id);
    }

    public fetchAllUsers(): Promise<User[]> {
        return this.repo.find();
    }
}
