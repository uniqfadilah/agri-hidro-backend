import { Injectable, NotFoundException } from '@nestjs/common';

import { Seller } from '../../models';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

export type SellerResponse = {
  id: string;
  seller_name: string;
  address: string | null;
  contact: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class SellerService {
  async findAll(): Promise<SellerResponse[]> {
    const rows = await Seller.query()
      .select(
        'id',
        'seller_name',
        'address',
        'contact',
        'created_at',
        'updated_at',
      )
      .orderBy('created_at', 'desc');
    return rows.map((r) => ({
      id: r.id,
      seller_name: r.sellerName,
      address: r.address ?? null,
      contact: r.contact ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async create(dto: CreateSellerDto): Promise<SellerResponse> {
    const seller = await Seller.query().insertAndFetch({
      sellerName: dto.seller_name,
      address: dto.address ?? null,
      contact: dto.contact ?? null,
    });
    return this.toResponse(seller);
  }

  async update(id: string, dto: UpdateSellerDto): Promise<SellerResponse> {
    const seller = await Seller.query().findById(id);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    const patch: Record<string, unknown> = {};
    if (dto.seller_name !== undefined) patch.sellerName = dto.seller_name;
    if (dto.address !== undefined) patch.address = dto.address;
    if (dto.contact !== undefined) patch.contact = dto.contact;
    patch.updatedAt = new Date();
    const updated = await Seller.query().patchAndFetchById(id, patch);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const seller = await Seller.query().findById(id);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    await Seller.query().deleteById(id);
  }

  private toResponse(r: Seller): SellerResponse {
    return {
      id: r.id,
      seller_name: r.sellerName,
      address: r.address ?? null,
      contact: r.contact ?? null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }
}
