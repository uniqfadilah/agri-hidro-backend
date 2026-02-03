import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CustomerItemModule } from '../customer-item/customer-item.module';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';

@Module({
  imports: [AuthModule, CustomerItemModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
