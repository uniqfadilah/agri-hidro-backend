import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  pic?: string;

  @IsOptional()
  @IsString()
  pic_phone_number?: string;
}
