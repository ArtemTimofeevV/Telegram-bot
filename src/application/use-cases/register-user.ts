import { User } from '../../domain/entities/user';
import { UserRepository } from '../repositories/user-repository';

export class RegisterUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: Omit<User, 'role'>): Promise<User> {
    const newUser: User = {
      ...userData,
      role: 'user',
    };
    await this.userRepository.save(newUser);
    return newUser;
  }
}
