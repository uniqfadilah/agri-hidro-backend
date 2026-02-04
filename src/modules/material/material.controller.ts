import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateMaterialDto } from './dto/create-material.dto';
import { type MaterialResponse, MaterialService } from './material.service';

@Controller('materials')
@UseGuards(RolesGuard)
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  findAll(): Promise<MaterialResponse[]> {
    return this.materialService.findAll();
  }

  @Post()
  create(@Body() dto: CreateMaterialDto): Promise<MaterialResponse> {
    return this.materialService.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.materialService.delete(id);
    return { message: 'Material deleted' };
  }
}
