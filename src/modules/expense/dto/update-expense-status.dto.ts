import { IsEnum } from 'class-validator';

export type ExpenseStatusType = 'paid' | 'unpaid';

export class UpdateExpenseStatusDto {
  @IsEnum(['paid', 'unpaid'], {
    message: 'status must be one of: paid, unpaid',
  })
  status: ExpenseStatusType;
}
