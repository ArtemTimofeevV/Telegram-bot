import { User } from '../../domain/entities/user';

export interface UserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<void>;
}
