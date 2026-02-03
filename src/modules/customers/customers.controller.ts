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
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CustomerItemService } from '../customer-item/customer-item.service';
import type { CustomerItemResponse } from '../customer-item/customer-item.service';
import { CreateCustomerItemByCustomerDto } from './dto/create-customer-item-by-customer.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { type CustomerListItem, CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(RolesGuard)
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly customerItemService: CustomerItemService,
  ) {}

  @Get()
  findAll(): Promise<CustomerListItem[]> {
    return this.customersService.findAll();
  }

  @Get(':id/items')
  findItemsByCustomerId(
    @Param('id') id: string,
  ): Promise<CustomerItemResponse[]> {
    return this.customersService.findItemsByCustomerId(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateCustomerDto): Promise<CustomerListItem> {
    return this.customersService.create(dto);
  }

  @Post(':id/customer-items')
  async createCustomerItem(
    @Param('id') customerId: string,
    @Body() dto: CreateCustomerItemByCustomerDto,
  ): Promise<CustomerItemResponse> {
    return this.customerItemService.create({
      customer_id: customerId,
      item_id: dto.item_id,
      price: dto.price,
    });
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.customersService.delete(id);
    return { message: 'Customer deleted' };
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerListItem> {
    return this.customersService.update(id, dto);
  }
}
