import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { Customer, CustomerItem } from '../../models';
import { formatPrice } from '../../utils/format-price';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

export type CustomerItemResponse = {
  id: string;
  customer_id: string;
  item_id: string;
  item_name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerListItem = {
  id: string;
  name: string;
  pic: string;
  pic_phone_number: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class CustomersService {
  async findByIdOrThrow(customerId: string): Promise<void> {
    const customer = await Customer.query().findById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
  }

  async findItemsByCustomerId(
    customerId: string,
  ): Promise<CustomerItemResponse[]> {
    const customer = await Customer.query().findById(customerId);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const rows = await CustomerItem.query()
      .where('customer_id', customerId)
      .withGraphFetched('item')
      .orderBy('created_at', 'desc');
    return rows.map((r) => ({
      id: r.id,
      customer_id: r.customerId,
      item_id: r.itemId,
      item_name: r.item?.name ?? '',
      price: formatPrice(r.price),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async findAll(): Promise<CustomerListItem[]> {
    const rows = await Customer.query()
      .select('id', 'name', 'pic', 'pic_phone_number', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      pic: r.pic,
      pic_phone_number: r.picPhoneNumber,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async create(dto: CreateCustomerDto): Promise<CustomerListItem> {
    const customer = await Customer.query().insertAndFetch({
      id: randomUUID(),
      name: dto.name,
      pic: dto.pic,
      picPhoneNumber: dto.pic_phone_number,
    });
    return {
      id: customer.id,
      name: customer.name,
      pic: customer.pic,
      pic_phone_number: customer.picPhoneNumber,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    const customer = await Customer.query().findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    await Customer.query().deleteById(id);
  }

  async update(
    id: string,
    dto: UpdateCustomerDto,
  ): Promise<CustomerListItem> {
    const customer = await Customer.query().findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    const patch: Record<string, unknown> = {};
    if (dto.name !== undefined) patch.name = dto.name;
    if (dto.pic !== undefined) patch.pic = dto.pic;
    if (dto.pic_phone_number !== undefined)
      patch.picPhoneNumber = dto.pic_phone_number;
    const updated = await Customer.query().patchAndFetchById(id, patch);
    return {
      id: updated.id,
      name: updated.name,
      pic: updated.pic,
      pic_phone_number: updated.picPhoneNumber,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
