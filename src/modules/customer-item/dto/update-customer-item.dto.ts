import { IsNumber, Min } from 'class-validator';

export class UpdateCustomerItemDto {
  @IsNumber()
  @Min(0.01, { message: 'price must be greater than 0' })
  price: number;
}
