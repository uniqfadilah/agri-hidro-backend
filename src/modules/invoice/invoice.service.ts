/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Customer,
  Invoice,
  InvoiceItem,
  Item,
  type InvoiceStatus,
} from '../../models';
import type { InvoiceStatusType } from './dto/update-invoice-status.dto';
import { formatPrice } from '../../utils/format-price';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';

export type InvoiceItemResponse = {
  id: string;
  item_id: string;
  item_name?: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type InvoiceResponse = {
  id: string;
  customer_id: string;
  user_id: string;
  customer_name?: string;
  user_name?: string;
  status: InvoiceStatus;
  createdAt: Date;
  updatedAt: Date;
  invoiceItems?: InvoiceItemResponse[];
};

@Injectable()
export class InvoiceService {
  async create(
    dto: CreateInvoiceDto,
    userId: string,
  ): Promise<InvoiceResponse> {
    const customer = await Customer.query().findById(dto.customer_id);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    for (const line of dto.items) {
      const item = await Item.query().findById(line.item_id);
      if (!item) {
        throw new BadRequestException(`Item not found: ${line.item_id}`);
      }
    }

    const invoice = await Invoice.transaction(async (trx) => {
      const inv = await Invoice.query(trx).insertAndFetch({
        customerId: dto.customer_id,
        userId,
        status: 'new',
      });

      for (const line of dto.items) {
        await InvoiceItem.query(trx).insert({
          invoiceId: inv.id,
          itemId: line.item_id,
          price: String(line.price),
          quantity: line.quantity,
        });
      }

      return inv;
    });

    const withItems = await Invoice.query()
      .findById(invoice.id)
      .withGraphFetched('invoiceItems.item')
      .modifyGraph('invoiceItems.item', (qb) =>
        qb.select('items.id', 'items.name'),
      );
    if (!withItems) throw new NotFoundException('Invoice not found');
    return this.toResponse(withItems);
  }

  async findAll(
    userId: string,
    isAdmin: boolean,
    options?: {
      status?: InvoiceStatusType;
      month?: string;
      customer_id?: string;
    },
  ): Promise<InvoiceResponse[]> {
    const query = Invoice.query()
      .select(
        'id',
        'customer_id',
        'user_id',
        'status',
        'created_at',
        'updated_at',
      )
      .withGraphFetched('[invoiceItems.item, customer, user]')
      .modifyGraph('invoiceItems.item', (qb) => qb.select('id', 'name'))
      .orderBy('created_at', 'desc');

    if (!isAdmin) {
      query.where('user_id', userId);
    }
    if (options?.status) {
      query.where('status', options.status);
    }
    if (options?.customer_id) {
      query.where('customer_id', options.customer_id);
    }
    if (options?.month) {
      const [y, m] = options.month.split('-').map(Number);
      const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
      query.where('created_at', '>=', start).where('created_at', '<', end);
    }

    const rows = (await query) as (Invoice & {
      customer?: { name: string };
      user?: { username: string };
      invoiceItems?: (InvoiceItem & { item?: { name: string } })[];
    })[];
    return rows.map((r) => this.toResponse(r));
  }

  async findOne(
    id: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<InvoiceResponse> {
    const invoice = await Invoice.query()
      .findById(id)
      .withGraphFetched('invoiceItems.item')
      .modifyGraph('invoiceItems.item', (qb) =>
        qb.select('items.id', 'items.name'),
      );
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    if (!isAdmin && invoice.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.toResponse(invoice);
  }

  async updateStatus(
    id: string,
    dto: UpdateInvoiceStatusDto,
    userId: string,
    isAdmin: boolean,
  ): Promise<InvoiceResponse> {
    const invoice = await Invoice.query().findById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    if (!isAdmin && invoice.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (dto.status === 'done_paid') {
      if (!isAdmin) {
        throw new ForbiddenException('Only admin can set status to done_paid');
      }
    } else if (dto.status === 'on_progress') {
      if (invoice.status !== 'new') {
        throw new BadRequestException(
          'Status can only change from new to on_progress',
        );
      }
    }

    const patch: {
      status: InvoiceStatusType;
      updatedAt: Date;
      createdAt?: Date;
    } = {
      status: dto.status,
      updatedAt: new Date(),
    };
    if (dto.createdAt != null) {
      patch.createdAt = new Date(dto.createdAt);
    }
    await Invoice.query().patchAndFetchById(id, patch);
    const withItems = await Invoice.query()
      .findById(id)
      .withGraphFetched('invoiceItems.item')
      .modifyGraph('invoiceItems.item', (qb) =>
        qb.select('items.id', 'items.name'),
      );
    if (!withItems) throw new NotFoundException('Invoice not found');
    return this.toResponse(withItems);
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const invoice = await Invoice.query().findById(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    if (!isAdmin && invoice.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await InvoiceItem.query().where('invoice_id', id).delete();
    await Invoice.query().deleteById(id);
  }

  private toResponse(invoice: {
    id: string;
    customerId: string;
    userId: string;
    status: InvoiceStatus;
    createdAt: Date;
    updatedAt: Date;
    invoiceItems?: Array<{
      id: string;
      itemId: string;
      price: string;
      quantity: number;
      createdAt: Date;
      updatedAt: Date;
      item?: { name: string };
    }>;
    customer?: { name: string };
    user?: { username: string };
  }): InvoiceResponse {
    const out: InvoiceResponse = {
      id: invoice.id,
      customer_id: invoice.customerId,
      user_id: invoice.userId,
      status: invoice.status,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
    if (invoice.customer?.name != null) {
      out.customer_name = invoice.customer.name;
    }
    if (invoice.user?.username != null) {
      out.user_name = invoice.user.username;
    }
    if (invoice.invoiceItems?.length) {
      out.invoiceItems = invoice.invoiceItems.map((ii) => ({
        id: ii.id,
        item_id: ii.itemId,
        item_name: ii.item?.name,
        price: formatPrice(ii.price),
        quantity: ii.quantity,
        createdAt: ii.createdAt,
        updatedAt: ii.updatedAt,
      }));
    }
    return out;
  }
}
