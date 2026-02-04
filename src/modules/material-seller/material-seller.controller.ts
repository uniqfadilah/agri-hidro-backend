/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateMaterialSellerDto } from './dto/create-material-seller.dto';
import { UpdateMaterialSellerDto } from './dto/update-material-seller.dto';
import {
  type MaterialSellerResponse,
  MaterialSellerService,
} from './material-seller.service';

@Controller('material-sellers')
@UseGuards(RolesGuard)
export class MaterialSellerController {
  constructor(private readonly materialSellerService: MaterialSellerService) {}

  @Get()
  findAll(): Promise<MaterialSellerResponse[]> {
    return this.materialSellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MaterialSellerResponse> {
    return this.materialSellerService.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateMaterialSellerDto,
  ): Promise<MaterialSellerResponse> {
    return this.materialSellerService.createOrUpdateByMaterialAndSeller({
      material_id: dto.material_id,
      seller_id: dto.seller_id,
      price: dto.price,
    });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMaterialSellerDto,
  ): Promise<MaterialSellerResponse> {
    return this.materialSellerService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.materialSellerService.delete(id);
    return { message: 'Material seller deleted' };
  }
}
