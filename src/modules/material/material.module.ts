import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';

@Module({
  imports: [AuthModule],
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}
