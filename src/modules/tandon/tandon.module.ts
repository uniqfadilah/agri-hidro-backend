import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TandonController } from './tandon.controller';
import { TandonService } from './tandon.service';

@Module({
  imports: [AuthModule],
  controllers: [TandonController],
  providers: [TandonService],
  exports: [TandonService],
})
export class TandonModule {}
