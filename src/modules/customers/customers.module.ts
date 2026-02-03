import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CustomerItemModule } from '../customer-item/customer-item.module';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  imports: [AuthModule, CustomerItemModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
