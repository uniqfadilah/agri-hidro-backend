import { IsEnum } from 'class-validator';

export type ExpenseStatusType = 'paid' | 'un_paid';

export class UpdateExpenseStatusDto {
  @IsEnum(['paid', 'un_paid'], {
    message: 'status must be one of: paid, un_paid',
  })
  status: ExpenseStatusType;
}
