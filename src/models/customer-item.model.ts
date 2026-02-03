import Objection from 'objection';

import { BaseModel } from './base.model';
import { Customer } from './customer.model';
import { Item } from './item.model';

export class CustomerItem extends BaseModel {
  static get tableName(): string {
    return 'customer_items';
  }

  declare id: string;
  declare customerId: string;
  declare itemId: string;
  declare price: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare item?: Item;

  static get relationMappings() {
    const { Model } = Objection;
    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'customer_items.customer_id',
          to: 'customers.id',
        },
      },
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'customer_items.item_id',
          to: 'items.id',
        },
      },
    };
  }
}
