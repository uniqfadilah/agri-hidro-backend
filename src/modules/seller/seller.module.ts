import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MaterialSellerModule } from '../material-seller/material-seller.module';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
  imports: [AuthModule, MaterialSellerModule],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}
