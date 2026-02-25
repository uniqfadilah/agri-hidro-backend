import type { Knex } from 'knex';
import Objection from 'objection';

const { Model } = Objection;

import { Customer } from './customer.model';
import { CustomerItem } from './customer-item.model';
import { Expense } from './expense.model';
import { PushToken } from './push-token.model';
import { ExpenseMaterial } from './expense-material.model';
import { Invoice } from './invoice.model';
import { InvoiceItem } from './invoice-item.model';
import { Item } from './item.model';
import { Material } from './material.model';
import { MaterialSeller } from './material-seller.model';
import { Seller } from './seller.model';
import { Tandon } from './tandon.model';
import { TandonReport } from './tandon-report.model';
import { User } from './user.model';

export { BaseModel } from './base.model';
export { Customer } from './customer.model';
export { CustomerItem } from './customer-item.model';
export { Expense } from './expense.model';
export { ExpenseMaterial } from './expense-material.model';
export { Invoice } from './invoice.model';
export { InvoiceItem } from './invoice-item.model';
export { Item } from './item.model';
export { Material } from './material.model';
export { MaterialSeller } from './material-seller.model';
export { PushToken } from './push-token.model';
export { Seller } from './seller.model';
export { Tandon } from './tandon.model';
export { TandonReport } from './tandon-report.model';
export { User } from './user.model';
export type { InvoiceStatus } from './invoice.model';
export type { Role } from './user.model';

/**
 * Bind the Knex instance to Objection Model so all models use it.
 * Called by DatabaseService when knex is first created.
 */
export function bindKnex(knex: Knex): void {
  Model.knex(knex);
}
