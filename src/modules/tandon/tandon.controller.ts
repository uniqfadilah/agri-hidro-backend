import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DeviceUpdateWaterDto } from './dto/device-update-water.dto';
import { CreateTandonDto } from './dto/create-tandon.dto';
import { UpdateTandonDto } from './dto/update-tandon.dto';
import {
  type TandonReportResponse,
  type TandonResponse,
  TandonService,
} from './tandon.service';

@Controller('tandon')
export class TandonController {
  constructor(private readonly tandonService: TandonService) {}

  @Post('device/update-water')
  @Public()
  deviceUpdateWater(
    @Body() dto: DeviceUpdateWaterDto,
  ): Promise<TandonResponse> {
    return this.tandonService.deviceUpdateWater(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  findAll(): Promise<TandonResponse[]> {
    return this.tandonService.findAll();
  }

  @Get('report/:code')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getReportsByCode(
    @Param('code') code: string,
  ): Promise<TandonReportResponse[]> {
    return this.tandonService.findReportsByTandonCode(code);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string): Promise<TandonResponse> {
    return this.tandonService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateTandonDto): Promise<TandonResponse> {
    return this.tandonService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTandonDto,
  ): Promise<TandonResponse> {
    return this.tandonService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.tandonService.delete(id);
    return { message: 'Tandon deleted' };
  }
}
