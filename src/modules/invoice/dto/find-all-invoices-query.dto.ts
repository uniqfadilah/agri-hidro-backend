import { IsEnum, IsOptional } from 'class-validator';
import { type InvoiceStatusType } from './update-invoice-status.dto';

export class FindAllInvoicesQueryDto {
  @IsOptional()
  @IsEnum(['new', 'on_progress', 'done_paid'], {
    message: 'status must be one of: new, on_progress, done_paid',
  })
  status?: InvoiceStatusType;
}
