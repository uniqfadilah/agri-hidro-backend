import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  seller_name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contact?: string;
}
