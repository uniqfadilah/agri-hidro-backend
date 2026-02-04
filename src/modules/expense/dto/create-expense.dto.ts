import { IsArray, IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateExpenseMaterialDto } from './create-expense-material.dto';

export class CreateExpenseDto {
  @IsUUID()
  seller_id: string;

  @IsOptional()
  @IsEnum(['paid', 'unpaid'], {
    message: 'status must be one of: paid, unpaid',
  })
  status?: 'paid' | 'unpaid';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseMaterialDto)
  materials: CreateExpenseMaterialDto[];
}
