import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class UpdateTandonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(4, 4, { message: 'code must be exactly 4 characters' })
  code?: string;

  @IsOptional()
  @IsString()
  @Length(8, 8, { message: 'jwt_secret must be exactly 8 characters' })
  jwt_secret?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'max_level_water must be a positive number' })
  max_level_water?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'min_level_water must be a positive number' })
  min_level_water?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'current_level_water must be a positive number' })
  current_level_water?: number;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'tandon_height must be a positive number' })
  tandon_height?: number;

  @IsOptional()
  @IsString()
  @IsIn(['full', 'refill'], { message: 'status must be full or refill' })
  status?: 'full' | 'refill';
}
