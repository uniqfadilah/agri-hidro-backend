import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateExpenseMaterialDto {
  @IsUUID()
  material_id: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}
