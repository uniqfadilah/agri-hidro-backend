import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateTandonDto {
  @IsString()
  @Expose()
  name: string;

  @IsOptional()
  @IsString()
  @Length(4, 4, { message: 'code must be exactly 4 characters' })
  @Expose()
  code?: string;

  @IsOptional()
  @IsString()
  @Length(8, 8, { message: 'jwt_secret must be exactly 8 characters' })
  @Expose()
  jwt_secret?: string;

  @IsNumber()
  @Min(0, { message: 'max_level_water must be a positive number' })
  @Expose()
  @Transform(({ value, obj }) => value ?? obj?.maxLevelWater)
  max_level_water: number;

  @IsNumber()
  @Min(0, { message: 'min_level_water must be a positive number' })
  @Expose()
  @Transform(({ value, obj }) => value ?? obj?.minLevelWater)
  min_level_water: number;

  @IsNumber()
  @Min(0, { message: 'current_level_water must be a positive number' })
  @Expose()
  @Transform(({ value, obj }) => value ?? obj?.currentLevelWater)
  current_level_water: number;

  @IsNumber()
  @Min(0, { message: 'tandon_height must be a positive number' })
  @Expose()
  @Transform(({ value, obj }) => value ?? obj?.tandonHeight)
  tandon_height: number;
}
