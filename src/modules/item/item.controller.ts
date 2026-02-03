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
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { type ItemListItem, ItemService } from './item.service';

@Controller('items')
@UseGuards(RolesGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  findAll(): Promise<ItemListItem[]> {
    return this.itemService.findAll();
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateItemDto): Promise<ItemListItem> {
    return this.itemService.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ): Promise<ItemListItem> {
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.itemService.delete(id);
    return { message: 'Item deleted' };
  }
}
