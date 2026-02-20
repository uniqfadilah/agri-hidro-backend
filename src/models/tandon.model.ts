import Objection from 'objection';

import { BaseModel } from './base.model';

export class Tandon extends BaseModel {
  static get tableName(): string {
    return 'tandons';
  }

  static get idColumn(): string {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['code', 'jwtSecret', 'maxLevelWater', 'minLevelWater', 'currentLevelWater'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        code: { type: 'string', minLength: 1, maxLength: 20 },
        jwtSecret: { type: 'string', minLength: 8, maxLength: 8 },
        maxLevelWater: { type: ['number', 'string'] },
        minLevelWater: { type: ['number', 'string'] },
        currentLevelWater: { type: ['number', 'string'] },
        tandonHeight: { type: ['number', 'string', 'null'] },
        createdAt: { type: ['string', 'object'], format: 'date-time' },
        updatedAt: { type: ['string', 'object'], format: 'date-time' },
      },
    };
  }

  declare id: string;
  declare code: string;
  declare jwtSecret: string;
  declare maxLevelWater: string;
  declare minLevelWater: string;
  declare currentLevelWater: string;
  declare tandonHeight: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}
