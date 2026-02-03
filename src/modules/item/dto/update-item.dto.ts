import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @IsNotEmpty({ message: 'name must not be empty' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  name: string;
}
