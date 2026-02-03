import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { SafeUser } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { type ExpenseResponse, ExpenseService } from './expense.service';

@Controller('expenses')
@UseGuards(RolesGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  findAll(@CurrentUser() user: SafeUser): Promise<ExpenseResponse[]> {
    const asAdmin = user.role === 'admin';
    return this.expenseService.findAll(user.id, asAdmin);
  }

  @Post()
  create(
    @Body() dto: CreateExpenseDto,
    @CurrentUser() user: SafeUser,
  ): Promise<ExpenseResponse> {
    return this.expenseService.create(dto, user.id);
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
