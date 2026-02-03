import Objection from 'objection';

import { BaseModel } from './base.model';
import { Material } from './material.model';

export class Seller extends BaseModel {
  static get tableName(): string {
    return 'sellers';
  }

  declare id: string;
  declare sellerName: string;
  declare address: string | null;
  declare contact: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;

  static get relationMappings() {
    const { Model } = Objection;
    const MaterialSeller = require('./material-seller.model').MaterialSeller;
    const Expense = require('./expense.model').Expense;
    return {
      materialSellers: {
        relation: Model.HasManyRelation,
        modelClass: MaterialSeller,
        join: {
          from: 'sellers.id',
          to: 'material_sellers.seller_id',
        },
      },
      expenses: {
        relation: Model.HasManyRelation,
        modelClass: Expense,
        join: {
          from: 'sellers.id',
          to: 'expenses.seller_id',
        },
      },
    };
  }
}
