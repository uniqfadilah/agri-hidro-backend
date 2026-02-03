import { BaseModel } from './base.model';

export class Customer extends BaseModel {
  static get tableName(): string {
    return 'customers';
  }

  declare id: string;
  declare name: string;
  declare pic: string;
  declare picPhoneNumber: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}
