export type UserRole = 'user' | 'admin';

export interface User {
  id: number; // Telegram user ID
  username?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  role: UserRole;
}