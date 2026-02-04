import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { SafeUser } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { FindAllInvoicesQueryDto } from './dto/find-all-invoices-query.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { type InvoiceResponse, InvoiceService } from './invoice.service';

@Controller('invoices')
@UseGuards(RolesGuard)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(
    @Body() dto: CreateInvoiceDto,
    @CurrentUser() user: SafeUser,
  ): Promise<InvoiceResponse> {
    return this.invoiceService.create(dto, user.id);
  }

  @Get()
  findAll(
    @CurrentUser() user: SafeUser,
    @Query() query: FindAllInvoicesQueryDto,
  ): Promise<InvoiceResponse[]> {
    const isAdmin = user.role === 'admin';
    return this.invoiceService.findAll(user.id, isAdmin, {
      status: query.status,
      month: query.month,
      customer_id: query.customer_id,
    });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ): Promise<InvoiceResponse> {
    const isAdmin = user.role === 'admin';
    return this.invoiceService.findOne(id, user.id, isAdmin);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
    @CurrentUser() user: SafeUser,
  ): Promise<InvoiceResponse> {
    const isAdmin = user.role === 'admin';
    return this.invoiceService.updateStatus(id, dto, user.id, isAdmin);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ): Promise<{ message: string }> {
    const isAdmin = user.role === 'admin';
    await this.invoiceService.delete(id, user.id, isAdmin);
    return { message: 'Invoice deleted' };
  }
}
