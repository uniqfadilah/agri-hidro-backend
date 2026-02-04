import { Injectable, NotFoundException } from '@nestjs/common';

import { Material } from '../../models';
import { CreateMaterialDto } from './dto/create-material.dto';

export type MaterialResponse = {
  id: string;
  material_name: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MaterialService {
  async findAll(): Promise<MaterialResponse[]> {
    const rows = await Material.query()
      .select('id', 'material_name', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');
    return rows.map((r) => ({
      id: r.id,
      material_name: r.materialName,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async create(dto: CreateMaterialDto): Promise<MaterialResponse> {
    const material = await Material.query().insertAndFetch({
      materialName: dto.material_name,
    });
    return {
      id: material.id,
      material_name: material.materialName,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    const material = await Material.query().findById(id);
    if (!material) {
      throw new NotFoundException('Material not found');
    }
    await Material.query().deleteById(id);
  }
}
