import { BaseModel } from './base.model';

export class PushToken extends BaseModel {
  static get tableName(): string {
    return 'push_tokens';
  }

  static get idColumn(): string {
    return 'id';
  }

  declare id: string;
  declare token: string;
  declare createdAt: Date;
}
