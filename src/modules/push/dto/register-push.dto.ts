import { IsString, MinLength } from 'class-validator';

export class RegisterPushDto {
  @IsString()
  @MinLength(1, { message: 'token is required (FCM device token)' })
  token: string;
}
