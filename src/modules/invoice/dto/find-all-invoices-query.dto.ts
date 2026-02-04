import { IsEnum, IsOptional, IsUUID, Matches } from 'class-validator';
import { type InvoiceStatusType } from './update-invoice-status.dto';

export class FindAllInvoicesQueryDto {
  @IsOptional()
  @IsEnum(['new', 'on_progress', 'done_paid'], {
    message: 'status must be one of: new, on_progress, done_paid',
  })
  status?: InvoiceStatusType;

  /** Filter by month (YYYY-MM). Example: 2025-01 */
  @IsOptional()
  @Matches(/^\d{4}-\d{2}$/, {
    message: 'month must be YYYY-MM (e.g. 2025-01)',
  })
  month?: string;

  /** Filter by customer id */
  @IsOptional()
  @IsUUID()
  customer_id?: string;
}
