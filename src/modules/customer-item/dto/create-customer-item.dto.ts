import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateCustomerItemDto {
  @IsString()
  customer_id: string;

  @IsUUID()
  item_id: string;

  @IsNumber()
  @Min(0.01, { message: 'price must be greater than 0' })
  price: number;
}
