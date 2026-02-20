import { IsNumber, IsString, Length, Min } from 'class-validator';

export class DeviceUpdateWaterDto {
  @IsString()
  @Length(4, 4, { message: 'code must be exactly 4 characters' })
  code: string;

  @IsString()
  @Length(8, 8, { message: 'jwt_secret must be exactly 8 characters' })
  jwt_secret: string;

  @IsNumber()
  @Min(0, { message: 'current_level_water must be a positive number' })
  current_level_water: number;
}
