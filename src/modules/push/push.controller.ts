import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../auth/decorators/public.decorator';
import { RegisterPushDto } from './dto/register-push.dto';
import { PushService } from './push.service';

/** Daftar FCM token untuk terima notifikasi blast (satu pesan ke semua device). */
@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('register')
  @Public()
  register(@Body() dto: RegisterPushDto): Promise<{ message: string }> {
    return this.pushService.registerToken(dto.token);
  }
}
