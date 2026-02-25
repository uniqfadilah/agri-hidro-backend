import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PushModule } from '../push/push.module';
import { TandonController } from './tandon.controller';
import { TandonService } from './tandon.service';

@Module({
  imports: [AuthModule, PushModule],
  controllers: [TandonController],
  providers: [TandonService],
  exports: [TandonService],
})
export class TandonModule {}
