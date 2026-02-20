import { BaseModel } from './base.model';

export class TandonReport extends BaseModel {
  static get tableName(): string {
    return 'tandon_reports';
  }

  static get idColumn(): string {
    return 'id';
  }

  declare id: string;
  declare tandonCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}
