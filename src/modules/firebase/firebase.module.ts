import { Global, Module } from '@nestjs/common';
import { PushModule } from '../push/push.module';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  imports: [PushModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
