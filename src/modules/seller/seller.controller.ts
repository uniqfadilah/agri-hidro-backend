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
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { type SellerResponse, SellerService } from './seller.service';

@Controller('sellers')
@UseGuards(RolesGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  findAll(): Promise<SellerResponse[]> {
    return this.sellerService.findAll();
  }

  @Post()
  create(@Body() dto: CreateSellerDto): Promise<SellerResponse> {
    return this.sellerService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSellerDto,
  ): Promise<SellerResponse> {
    return this.sellerService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.sellerService.delete(id);
    return { message: 'Seller deleted' };
  }
}
