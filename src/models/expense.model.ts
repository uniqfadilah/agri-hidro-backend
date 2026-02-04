import Objection from 'objection';

import { BaseModel } from './base.model';
import { User } from './user.model';
import { Seller } from './seller.model';

export class Expense extends BaseModel {
  static get tableName(): string {
    return 'expenses';
  }

  declare id: string;
  declare userId: string;
  declare sellerId: string;
  declare status: 'paid' | 'unpaid';
  declare createdAt: Date;
  declare updatedAt: Date;

  static get relationMappings() {
    const { Model } = Objection;
    const ExpenseMaterial = require('./expense-material.model').ExpenseMaterial;
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'expenses.user_id',
          to: 'users.id',
        },
      },
      seller: {
        relation: Model.BelongsToOneRelation,
        modelClass: Seller,
        join: {
          from: 'expenses.seller_id',
          to: 'sellers.id',
        },
      },
      expenseMaterials: {
        relation: Model.HasManyRelation,
        modelClass: ExpenseMaterial,
        join: {
          from: 'expenses.id',
          to: 'expense_materials.expense_id',
        },
      },
    };
  }
}
