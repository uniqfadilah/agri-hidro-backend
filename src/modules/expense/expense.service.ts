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
import { CreateExpenseDto } from './dto/create-expense.dto';

export type ExpenseMaterialResponse = {
  id: string;
  material_id: string;
  price: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseResponse = {
  id: string;
  user_id: string;
  seller_id: string;
  createdAt: Date;
  updatedAt: Date;
  expenseMaterials?: ExpenseMaterialResponse[];
};

@Injectable()
export class ExpenseService {
  async create(dto: CreateExpenseDto, userId: string): Promise<ExpenseResponse> {
    const seller = await Seller.query().findById(dto.seller_id);
    if (!seller) {
      throw new BadRequestException('Seller not found');
    }

    for (const line of dto.materials) {
      const material = await Material.query().findById(line.material_id);
      if (!material) {
        throw new BadRequestException(`Material not found: ${line.material_id}`);
      }
    }

    const expense = await Expense.transaction(async (trx) => {
      const exp = await Expense.query(trx).insertAndFetch({
        userId,
        sellerId: dto.seller_id,
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
      .withGraphFetched('expenseMaterials');
    return this.toResponse(withMaterials as Expense & { expenseMaterials: ExpenseMaterial[] });
  }

  async findAll(userId: string, asAdmin: boolean): Promise<ExpenseResponse[]> {
    let query = Expense.query().withGraphFetched('expenseMaterials').orderBy('expenses.created_at', 'desc');
    if (!asAdmin) {
      query = query.where('expenses.user_id', userId);
    }
    const rows = (await query) as (Expense & { expenseMaterials?: ExpenseMaterial[] })[];
    return rows.map((row) => this.toResponse(row));
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
    row: Expense & { expenseMaterials?: ExpenseMaterial[] },
  ): ExpenseResponse {
    const out: ExpenseResponse = {
      id: row.id,
      user_id: row.userId,
      seller_id: row.sellerId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
    if (row.expenseMaterials?.length) {
      out.expenseMaterials = row.expenseMaterials.map((em) => ({
        id: em.id,
        material_id: em.materialId,
        price: em.price,
        quantity: em.quantity,
        createdAt: em.createdAt,
        updatedAt: em.updatedAt,
      }));
    }
    return out;
  }
}
