import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Customer, CustomerItem, Item } from '../../models';
import { formatPrice } from '../../utils/format-price';
import { CreateCustomerItemDto } from './dto/create-customer-item.dto';
import { UpdateCustomerItemDto } from './dto/update-customer-item.dto';

export type CustomerItemResponse = {
  id: string;
  customer_id: string;
  item_id: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CustomerItemService {
  async findAll(): Promise<CustomerItemResponse[]> {
    const rows = await CustomerItem.query()
      .select(
        'id',
        'customer_id',
        'item_id',
        'price',
        'created_at',
        'updated_at',
      )
      .orderBy('created_at', 'desc');
    return rows.map((r) => this.toResponse(r));
  }

  async findAllByCustomerId(
    customerId: string,
  ): Promise<CustomerItemResponse[]> {
    const rows = await CustomerItem.query()
      .where('customer_id', customerId)
      .select(
        'id',
        'customer_id',
        'item_id',
        'price',
        'created_at',
        'updated_at',
      )
      .orderBy('created_at', 'desc');
    return rows.map((r) => this.toResponse(r));
  }

  async findOne(id: string): Promise<CustomerItemResponse> {
    const row = await CustomerItem.query().findById(id);
    if (!row) {
      throw new NotFoundException('Customer item not found');
    }
    return this.toResponse(row);
  }

  async create(dto: CreateCustomerItemDto): Promise<CustomerItemResponse> {
    const customer = await Customer.query().findById(dto.customer_id);

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    const item = await Item.query().findById(dto.item_id);
    if (!item) {
      throw new BadRequestException('Item not found');
    }

    const existing = await CustomerItem.query()
      .where('customer_id', dto.customer_id)
      .where('item_id', dto.item_id)
      .first();
    if (existing) {
      throw new ConflictException(
        'A price for this customer and item already exists',
      );
    }

    const customerItem = await CustomerItem.query().insertAndFetch({
      customerId: dto.customer_id,
      itemId: dto.item_id,
      price: String(dto.price),
    });
    return this.toResponse(customerItem);
  }

  /** Create or update customer-item by customer_id + item_id. */
  async createOrUpdateByCustomerAndItem(dto: {
    customer_id: string;
    item_id: string;
    price: number;
  }): Promise<CustomerItemResponse> {
    const customer = await Customer.query().findById(dto.customer_id);
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }
    const item = await Item.query().findById(dto.item_id);
    if (!item) {
      throw new BadRequestException('Item not found');
    }

    const existing = await CustomerItem.query()
      .where('customer_id', dto.customer_id)
      .where('item_id', dto.item_id)
      .first();

    if (existing) {
      const updated = await CustomerItem.query().patchAndFetchById(
        existing.id,
        {
          price: String(dto.price),
          updatedAt: new Date(),
        },
      );
      return this.toResponse(updated);
    }

    const customerItem = await CustomerItem.query().insertAndFetch({
      customerId: dto.customer_id,
      itemId: dto.item_id,
      price: String(dto.price),
    });
    return this.toResponse(customerItem);
  }

  async update(
    id: string,
    dto: UpdateCustomerItemDto,
  ): Promise<CustomerItemResponse> {
    const row = await CustomerItem.query().findById(id);
    if (!row) {
      throw new NotFoundException('Customer item not found');
    }
    const updated = await CustomerItem.query().patchAndFetchById(id, {
      price: String(dto.price),
      updatedAt: new Date(),
    });
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const row = await CustomerItem.query().findById(id);
    if (!row) {
      throw new NotFoundException('Customer item not found');
    }
    await CustomerItem.query().deleteById(id);
  }

  private toResponse(row: {
    id: string;
    customerId: string;
    itemId: string;
    price: string;
    createdAt: Date;
    updatedAt: Date;
  }): CustomerItemResponse {
    return {
      id: row.id,
      customer_id: row.customerId,
      item_id: row.itemId,
      price: formatPrice(row.price),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
