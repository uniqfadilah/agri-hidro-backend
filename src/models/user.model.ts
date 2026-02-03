import { BaseModel } from './base.model';

export type Role = 'admin' | 'user';

export class User extends BaseModel {
  static get tableName(): string {
    return 'users';
  }

  declare id: string;
  declare username: string;
  declare password: string;
  declare role: Role;
  declare createdAt: Date;
  declare updatedAt: Date;
}
