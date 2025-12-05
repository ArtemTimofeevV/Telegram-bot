import {UserRepository} from '../../application/repositories/user-repository';
import {User} from '../../domain/entities/user';

export class InMemoryUserRepository implements UserRepository {
    private users: Map<number, User> = new Map();

    async findById(id: number): Promise<User | null> {
        const user = this.users.get(id);
        return user ? {...user} : null;
    }

    async save(user: User): Promise<void> {
        this.users.set(user.id, {...user});
    }
}
