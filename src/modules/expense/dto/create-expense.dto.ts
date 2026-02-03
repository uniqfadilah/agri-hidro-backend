import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateExpenseMaterialDto } from './create-expense-material.dto';

export class CreateExpenseDto {
  @IsUUID()
  seller_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseMaterialDto)
  materials: CreateExpenseMaterialDto[];
}
