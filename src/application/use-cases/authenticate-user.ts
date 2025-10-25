import { UserRepository } from '../repositories/user-repository';

export class AuthenticateAdmin {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: number, providedCode: string, adminCode: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      // User must be registered first before becoming an admin.
      return false;
    }

    if (providedCode === adminCode) {
      user.role = 'admin';
      await this.userRepository.save(user);
      return true;
    }

    return false;
  }
}