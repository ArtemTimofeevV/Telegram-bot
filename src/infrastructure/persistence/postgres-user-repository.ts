import { Pool } from 'pg';

import db from './db';
import { UserRepository } from '../../application/repositories/user-repository';
import { User } from '../../domain/entities/user';

export class PostgresUserRepository implements UserRepository {
  private db: Pool;

  constructor() {
    this.db = db;
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT id, username, "firstName", "lastName", "dateOfBirth", role FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as User;
  }

  async save(user: User): Promise<void> {
    const { id, username, firstName, lastName, dateOfBirth, role } = user;
    const query = `
      INSERT INTO users (id, username, "firstName", "lastName", "dateOfBirth", role)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE
      SET username = EXCLUDED.username,
          "firstName" = EXCLUDED."firstName",
          "lastName" = EXCLUDED."lastName",
          "dateOfBirth" = EXCLUDED."dateOfBirth",
          role = EXCLUDED.role
    `;
    const values = [id, username, firstName, lastName, dateOfBirth, role];
    await this.db.query(query, values);
  }
}
