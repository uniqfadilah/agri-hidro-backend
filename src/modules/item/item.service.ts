import { Injectable, NotFoundException } from '@nestjs/common';

import { Item } from '../../models';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

export type ItemListItem = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ItemService {
  async findByIdOrThrow(id: string): Promise<void> {
    const item = await Item.query().findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
  }

  async findAll(): Promise<ItemListItem[]> {
    const rows = await Item.query()
      .select('id', 'name', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async create(dto: CreateItemDto): Promise<ItemListItem> {
    const item = await Item.query().insertAndFetch({
      name: dto.name.trim(),
    });
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async update(id: string, dto: UpdateItemDto): Promise<ItemListItem> {
    const item = await Item.query().findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    const updated = await Item.query().patchAndFetchById(id, {
      name: dto.name.trim(),
      updatedAt: new Date(),
    });
    return {
      id: updated.id,
      name: updated.name,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    const item = await Item.query().findById(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    await Item.query().deleteById(id);
  }
}
