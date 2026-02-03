import Objection from 'objection';

import { BaseModel } from './base.model';
import { Item } from './item.model';

export class InvoiceItem extends BaseModel {
  static get tableName(): string {
    return 'invoice_items';
  }

  declare id: string;
  declare invoiceId: string;
  declare itemId: string;
  declare price: string;
  declare quantity: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  static get relationMappings() {
    const { Model } = Objection;
    const Invoice = require('./invoice.model').Invoice;
    return {
      invoice: {
        relation: Model.BelongsToOneRelation,
        modelClass: Invoice,
        join: {
          from: 'invoice_items.invoice_id',
          to: 'invoices.id',
        },
      },
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'invoice_items.item_id',
          to: 'items.id',
        },
      },
    };
  }
}
