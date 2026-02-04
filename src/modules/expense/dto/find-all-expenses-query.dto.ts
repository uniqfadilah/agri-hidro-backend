import { IsEnum, IsOptional, IsUUID, Matches } from 'class-validator';
import { type ExpenseStatusType } from './update-expense-status.dto';

export class FindAllExpensesQueryDto {
  @IsOptional()
  @IsEnum(['paid', 'unpaid'], {
    message: 'status must be one of: paid, unpaid',
  })
  status?: ExpenseStatusType;

  /** Filter by month (YYYY-MM). Example: 2025-01 */
  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'month must be YYYY-MM (e.g. 2025-01)',
  })
  month?: string;

  /** Filter by seller id */
  @IsOptional()
  @IsUUID()
  seller_id?: string;
}
