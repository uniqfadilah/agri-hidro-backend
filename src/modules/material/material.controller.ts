import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
}
