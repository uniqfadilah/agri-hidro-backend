import Objection from 'objection';

import { BaseModel } from './base.model';
import { Material } from './material.model';
import { Seller } from './seller.model';

export class MaterialSeller extends BaseModel {
  static get tableName(): string {
    return 'material_sellers';
  }

  declare id: string;
  declare materialId: string;
  declare sellerId: string;
  declare price: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static get relationMappings() {
    const { Model } = Objection;
    return {
      material: {
        relation: Model.BelongsToOneRelation,
        modelClass: Material,
        join: {
          from: 'material_sellers.material_id',
          to: 'materials.id',
        },
      },
      seller: {
        relation: Model.BelongsToOneRelation,
        modelClass: Seller,
        join: {
          from: 'material_sellers.seller_id',
          to: 'sellers.id',
        },
      },
    };
  }
}
