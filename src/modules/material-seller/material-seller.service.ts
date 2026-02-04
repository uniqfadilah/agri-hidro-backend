import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Material, MaterialSeller, Seller } from '../../models';
import { formatPrice } from '../../utils/format-price';
import { CreateMaterialSellerDto } from './dto/create-material-seller.dto';
import { UpdateMaterialSellerDto } from './dto/update-material-seller.dto';

export type MaterialSellerResponse = {
  id: string;
  material_id: string;
  material_name?: string;
  seller_id: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MaterialSellerService {
  async findAll(): Promise<MaterialSellerResponse[]> {
    const rows = await MaterialSeller.query()
      .select(
        'id',
        'material_id',
        'seller_id',
        'price',
        'created_at',
        'updated_at',
      )
      .orderBy('created_at', 'desc');
    return rows.map((r) => this.toResponse(r));
  }

  async findOne(id: string): Promise<MaterialSellerResponse> {
    const row = await MaterialSeller.query().findById(id);
    if (!row) {
      throw new NotFoundException('Material seller not found');
    }
    return this.toResponse(row);
  }

  async findAllBySellerId(
    sellerId: string,
  ): Promise<MaterialSellerResponse[]> {
    const seller = await Seller.query().findById(sellerId);
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }
    const rows = (await MaterialSeller.query()
      .where('seller_id', sellerId)
      .withGraphFetched('material')
      .modifyGraph('material', (qb) => qb.select('id', 'material_name'))
      .orderBy('created_at', 'desc')) as (MaterialSeller & {
      material?: { materialName: string };
    })[];
    return rows.map((r) => this.toResponse(r));
  }

  async create(dto: CreateMaterialSellerDto): Promise<MaterialSellerResponse> {
    const material = await Material.query().findById(dto.material_id);
    if (!material) {
      throw new BadRequestException('Material not found');
    }
    const seller = await Seller.query().findById(dto.seller_id);
    if (!seller) {
      throw new BadRequestException('Seller not found');
    }

    const existing = await MaterialSeller.query()
      .where('material_id', dto.material_id)
      .where('seller_id', dto.seller_id)
      .first();
    if (existing) {
      throw new ConflictException(
        'This material-seller combination already exists',
      );
    }

    const row = await MaterialSeller.query().insertAndFetch({
      materialId: dto.material_id,
      sellerId: dto.seller_id,
      price: String(dto.price),
    });
    return this.toResponse(row);
  }

  /** Create or update material-seller by material_id + seller_id. */
  async createOrUpdateByMaterialAndSeller(dto: {
    material_id: string;
    seller_id: string;
    price: number;
  }): Promise<MaterialSellerResponse> {
    const material = await Material.query().findById(dto.material_id);
    if (!material) {
      throw new BadRequestException('Material not found');
    }
    const seller = await Seller.query().findById(dto.seller_id);
    if (!seller) {
      throw new BadRequestException('Seller not found');
    }

    const existing = await MaterialSeller.query()
      .where('material_id', dto.material_id)
      .where('seller_id', dto.seller_id)
      .first();

    if (existing) {
      const updated = await MaterialSeller.query().patchAndFetchById(
        existing.id,
        {
          price: String(dto.price),
          updatedAt: new Date(),
        },
      );
      return this.toResponse(updated);
    }

    const row = await MaterialSeller.query().insertAndFetch({
      materialId: dto.material_id,
      sellerId: dto.seller_id,
      price: String(dto.price),
    });
    return this.toResponse(row);
  }

  async update(
    id: string,
    dto: UpdateMaterialSellerDto,
  ): Promise<MaterialSellerResponse> {
    const row = await MaterialSeller.query().findById(id);
    if (!row) {
      throw new NotFoundException('Material seller not found');
    }
    const updated = await MaterialSeller.query().patchAndFetchById(id, {
      price: String(dto.price),
      updatedAt: new Date(),
    });
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const row = await MaterialSeller.query().findById(id);
    if (!row) {
      throw new NotFoundException('Material seller not found');
    }
    await MaterialSeller.query().deleteById(id);
  }

  private toResponse(
    row: {
      id: string;
      materialId: string;
      sellerId: string;
      price: string | number;
      createdAt: Date;
      updatedAt: Date;
      material?: { materialName: string };
    },
  ): MaterialSellerResponse {
    const out: MaterialSellerResponse = {
      id: row.id,
      material_id: row.materialId,
      seller_id: row.sellerId,
      price: formatPrice(row.price),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
    if (row.material?.materialName != null) {
      out.material_name = row.material.materialName;
    }
    return out;
  }
}
