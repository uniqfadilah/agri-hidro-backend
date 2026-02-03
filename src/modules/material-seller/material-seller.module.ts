import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MaterialSellerController } from './material-seller.controller';
import { MaterialSellerService } from './material-seller.service';

@Module({
  imports: [AuthModule],
  controllers: [MaterialSellerController],
  providers: [MaterialSellerService],
  exports: [MaterialSellerService],
})
export class MaterialSellerModule {}
