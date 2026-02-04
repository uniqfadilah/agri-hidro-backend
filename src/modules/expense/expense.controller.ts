import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { SafeUser } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { FindAllExpensesQueryDto } from './dto/find-all-expenses-query.dto';
import { UpdateExpenseStatusDto } from './dto/update-expense-status.dto';
import { type ExpenseResponse, ExpenseService } from './expense.service';

@Controller('expenses')
@UseGuards(RolesGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: SafeUser,
  ): Promise<ExpenseResponse> {
    return this.expenseService.create(dto, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: SafeUser,
    @Query() query: FindAllExpensesQueryDto,
  ): Promise<ExpenseResponse[]> {
    const asAdmin = user.role === 'admin';
    return this.expenseService.findAll(user.id, asAdmin, {
      status: query.status,
      month: query.month,
      seller_id: query.seller_id,
    });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ): Promise<ExpenseResponse> {
    const asAdmin = user.role === 'admin';
    return this.expenseService.findOne(id, user.id, asAdmin);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateExpenseStatusDto,
    @CurrentUser() user: SafeUser,
  ): Promise<ExpenseResponse> {
    const asAdmin = user.role === 'admin';
    return this.expenseService.updateStatus(id, dto, user.id, asAdmin);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ): Promise<{ message: string }> {
    const asAdmin = user.role === 'admin';
    await this.expenseService.delete(id, user.id, asAdmin);
    return { message: 'Expense deleted' };
  }
}
