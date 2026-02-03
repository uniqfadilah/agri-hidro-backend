import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  seller_name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contact?: string;
}
