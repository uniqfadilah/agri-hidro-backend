import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsUUID()
  item_id: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
