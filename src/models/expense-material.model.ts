import Objection from 'objection';

import { BaseModel } from './base.model';
import { Material } from './material.model';

export class ExpenseMaterial extends BaseModel {
  static get tableName(): string {
    return 'expense_materials';
  }

  declare id: string;
  declare expenseId: string;
  declare materialId: string;
  declare price: string;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  static get relationMappings() {
    const { Model } = Objection;
    const Expense = require('./expense.model').Expense;
    return {
      expense: {
        relation: Model.BelongsToOneRelation,
        modelClass: Expense,
        join: {
          from: 'expense_materials.expense_id',
          to: 'expenses.id',
        },
      },
      material: {
        relation: Model.BelongsToOneRelation,
        modelClass: Material,
        join: {
          from: 'expense_materials.material_id',
          to: 'materials.id',
        },
      },
    };
  }
}
