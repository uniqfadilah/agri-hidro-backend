import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateMaterialSellerDto } from './dto/create-material-seller.dto';
import {
  type MaterialSellerResponse,
  MaterialSellerService,
} from './material-seller.service';

@Controller('material-sellers')
@UseGuards(RolesGuard)
export class MaterialSellerController {
  constructor(
    private readonly materialSellerService: MaterialSellerService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateMaterialSellerDto,
  ): Promise<MaterialSellerResponse> {
    return this.materialSellerService.create(dto);
  }
}
