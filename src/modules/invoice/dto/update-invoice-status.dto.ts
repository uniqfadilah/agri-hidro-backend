import { IsEnum } from 'class-validator';

export type InvoiceStatusType = 'new' | 'on_progress' | 'done_paid';

export class UpdateInvoiceStatusDto {
  @IsEnum(['new', 'on_progress', 'done_paid'], {
    message: 'status must be one of: new, on_progress, done_paid',
  })
  status: InvoiceStatusType;
}
