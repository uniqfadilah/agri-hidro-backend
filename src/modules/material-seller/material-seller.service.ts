import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { Material, MaterialSeller, Seller } from '../../models';
import { CreateMaterialSellerDto } from './dto/create-material-seller.dto';

export type MaterialSellerResponse = {
  id: string;
  material_id: string;
  seller_id: string;
  price: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MaterialSellerService {
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
    return {
      id: row.id,
      material_id: row.materialId,
      seller_id: row.sellerId,
      price: row.price,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
