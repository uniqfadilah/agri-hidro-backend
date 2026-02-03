import Objection from 'objection';

import { BaseModel } from './base.model';
import { Customer } from './customer.model';
import { User } from './user.model';

export type InvoiceStatus = 'new' | 'on_progress' | 'done_paid';

export class Invoice extends BaseModel {
  static get tableName(): string {
    return 'invoices';
  }

  declare id: string;
  declare customerId: string;
  declare userId: string;
  declare status: InvoiceStatus;
  declare createdAt: Date;
  declare updatedAt: Date;

  static get relationMappings() {
    const { Model } = Objection;
    const InvoiceItem = require('./invoice-item.model').InvoiceItem;
    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: Customer,
        join: {
          from: 'invoices.customer_id',
          to: 'customers.id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'invoices.user_id',
          to: 'users.id',
        },
      },
      invoiceItems: {
        relation: Model.HasManyRelation,
        modelClass: InvoiceItem,
        join: {
          from: 'invoices.id',
          to: 'invoice_items.invoice_id',
        },
      },
    };
  }
}
