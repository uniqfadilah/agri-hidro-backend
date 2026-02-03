import { BaseModel } from './base.model';

export class Material extends BaseModel {
  static get tableName(): string {
    return 'materials';
  }

  declare id: string;
  declare materialName: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}
