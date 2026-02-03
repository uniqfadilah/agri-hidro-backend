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
import { CreateCustomerItemDto } from './dto/create-customer-item.dto';
import { UpdateCustomerItemDto } from './dto/update-customer-item.dto';
import {
  type CustomerItemResponse,
  CustomerItemService,
} from './customer-item.service';

@Controller('customer-items')
@UseGuards(RolesGuard)
export class CustomerItemController {
  constructor(private readonly customerItemService: CustomerItemService) {}

  @Get()
  findAll(): Promise<CustomerItemResponse[]> {
    return this.customerItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CustomerItemResponse> {
    return this.customerItemService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCustomerItemDto): Promise<CustomerItemResponse> {
    return this.customerItemService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerItemDto,
  ): Promise<CustomerItemResponse> {
    return this.customerItemService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.customerItemService.delete(id);
    return { message: 'Customer item deleted' };
  }
}
