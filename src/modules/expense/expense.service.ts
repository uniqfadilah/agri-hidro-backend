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

import { Expense, ExpenseMaterial, Material, Seller } from '../../models';
import { formatPrice } from '../../utils/format-price';
import { CreateExpenseDto } from './dto/create-expense.dto';
import type { ExpenseStatusType } from './dto/update-expense-status.dto';

export type ExpenseMaterialResponse = {
  id: string;
  material_id: string;
  material_name?: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseResponse = {
  id: string;
  user_id: string;
  seller_id: string;
  user_name?: string;
  seller_name?: string;
  status: 'paid' | 'unpaid';
  createdAt: Date;
  updatedAt: Date;
  expenseMaterials?: ExpenseMaterialResponse[];
};

@Injectable()
export class ExpenseService {
  async create(
    dto: CreateExpenseDto,
    userId: string,
  ): Promise<ExpenseResponse> {
    const seller = await Seller.query().findById(dto.seller_id);
    if (!seller) {
      throw new BadRequestException('Seller not found');
    }

    for (const line of dto.materials) {
      const material = await Material.query().findById(line.material_id);
      if (!material) {
        throw new BadRequestException(
          `Material not found: ${line.material_id}`,
        );
      }
    }

    const expense = await Expense.transaction(async (trx) => {
      const exp = await Expense.query(trx).insertAndFetch({
        userId,
        sellerId: dto.seller_id,
        status: dto.status ?? 'unpaid',
      });

      for (const line of dto.materials) {
        await ExpenseMaterial.query(trx).insert({
          expenseId: exp.id,
          materialId: line.material_id,
          price: String(line.price),
          quantity: line.quantity,
        });
      }

      return exp;
    });

    const withMaterials = await Expense.query()
      .findById(expense.id)
      .withGraphFetched('[expenseMaterials.material, seller, user]')
      .modifyGraph('expenseMaterials.material', (qb) =>
        qb.select('id', 'material_name'),
      );
    return this.toResponse(
      withMaterials as Expense & {
        expenseMaterials?: (ExpenseMaterial & {
          material?: { materialName: string };
        })[];
        seller?: { sellerName: string };
        user?: { username: string };
      },
    );
  }

  async findAll(
    userId: string,
    asAdmin: boolean,
    options?: {
      status?: ExpenseStatusType;
      month?: string;
      seller_id?: string;
    },
  ): Promise<ExpenseResponse[]> {
    const query = Expense.query()
      .select(
        'id',
        'user_id',
        'seller_id',
        'status',
        'created_at',
        'updated_at',
      )
      .withGraphFetched('[expenseMaterials.material, seller, user]')
      .modifyGraph('expenseMaterials.material', (qb) =>
        qb.select('id', 'material_name'),
      )
      .orderBy('created_at', 'desc');

    if (!asAdmin) {
      query.where('user_id', userId);
    }
    if (options?.status) {
      query.where('status', options.status);
    }
    if (options?.seller_id) {
      query.where('seller_id', options.seller_id);
    }
    if (options?.month) {
      const [y, m] = options.month.split('-').map(Number);
      const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
      query.where('created_at', '>=', start).where('created_at', '<', end);
    }

    const rows = (await query) as (Expense & {
      seller?: { sellerName: string };
      user?: { username: string };
      expenseMaterials?: (ExpenseMaterial & {
        material?: { materialName: string };
      })[];
    })[];
    return rows.map((r) => this.toResponse(r));
  }

  async findOne(
    id: string,
    userId: string,
    asAdmin: boolean,
  ): Promise<ExpenseResponse> {
    const expense = await Expense.query()
      .findById(id)
      .withGraphFetched('[expenseMaterials.material, seller, user]')
      .modifyGraph('expenseMaterials.material', (qb) =>
        qb.select('id', 'material_name'),
      );
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    if (!asAdmin && expense.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.toResponse(
      expense as Expense & {
        seller?: { sellerName: string };
        user?: { username: string };
        expenseMaterials?: (ExpenseMaterial & {
          material?: { materialName: string };
        })[];
      },
    );
  }

  async updateStatus(
    id: string,
    dto: { status: ExpenseStatusType },
    userId: string,
    asAdmin: boolean,
  ): Promise<ExpenseResponse> {
    const expense = await Expense.query().findById(id);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    if (!asAdmin && expense.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await Expense.query().patchAndFetchById(id, {
      status: dto.status,
      updatedAt: new Date(),
    });
    const withMaterials = await Expense.query()
      .findById(id)
      .withGraphFetched('[expenseMaterials.material, seller, user]')
      .modifyGraph('expenseMaterials.material', (qb) =>
        qb.select('id', 'material_name'),
      );
    if (!withMaterials) throw new NotFoundException('Expense not found');
    return this.toResponse(
      withMaterials as Expense & {
        seller?: { sellerName: string };
        user?: { username: string };
        expenseMaterials?: (ExpenseMaterial & {
          material?: { materialName: string };
        })[];
      },
    );
  }

  async delete(id: string, userId: string, asAdmin: boolean): Promise<void> {
    const expense = await Expense.query().findById(id);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    if (!asAdmin && expense.userId !== userId) {
      throw new ForbiddenException('You can only delete your own expense');
    }
    await Expense.query().deleteById(id);
  }

  private toResponse(
    row: Expense & {
      seller?: { sellerName?: string };
      user?: { username?: string };
      expenseMaterials?: Array<
        ExpenseMaterial & { material?: { materialName?: string } }
      >;
    },
  ): ExpenseResponse {
    const out: ExpenseResponse = {
      id: row.id,
      user_id: row.userId,
      seller_id: row.sellerId,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
    if (row.seller?.sellerName != null) {
      out.seller_name = row.seller.sellerName;
    }
    if (row.user?.username != null) {
      out.user_name = row.user.username;
    }
    if (row.expenseMaterials?.length) {
      out.expenseMaterials = row.expenseMaterials.map((em) => ({
        id: em.id,
        material_id: em.materialId,
        material_name: em.material?.materialName,
        price: formatPrice(em.price),
        quantity: em.quantity,
        createdAt: em.createdAt,
        updatedAt: em.updatedAt,
      }));
    }
    return out;
  }
}
