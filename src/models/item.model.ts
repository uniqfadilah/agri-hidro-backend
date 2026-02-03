import { BaseModel } from './base.model';

export class Item extends BaseModel {
  static get tableName(): string {
    return 'items';
  }

  declare id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}
