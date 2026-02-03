/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsString, MinLength } from 'class-validator';

export enum Role {
  admin = 'admin',
  user = 'user',
}

export class CreateUserDto {
  @IsString()
  @MinLength(1, { message: 'Username is required' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsEnum(Role, { message: 'Role must be admin or user' })
  role: Role;
}
