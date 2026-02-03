import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CustomerItemController } from './customer-item.controller';
import { CustomerItemService } from './customer-item.service';

@Module({
  imports: [AuthModule],
  controllers: [CustomerItemController],
  providers: [CustomerItemService],
  exports: [CustomerItemService],
})
export class CustomerItemModule {}
