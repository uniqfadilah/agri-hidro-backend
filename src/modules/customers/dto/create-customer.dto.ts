import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  pic: string;

  @IsString()
  @IsNotEmpty()
  pic_phone_number: string;
}
