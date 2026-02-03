import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCustomerItemByCustomerDto {
  @IsUUID()
  item_id: string;

  @IsNumber()
  @Min(0.01, { message: 'price must be greater than 0' })
  price: number;
}
