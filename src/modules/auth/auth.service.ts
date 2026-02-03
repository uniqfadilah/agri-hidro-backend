import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

import { User } from '../../models';
import type { Role } from '../../models';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

export type SafeUser = {
  id: string;
  username: string;
  role: Role;
};

export type AuthPayload = {
  sub: string;
  username: string;
};

export type AuthResponse = {
  user: SafeUser;
  access_token: string;
};

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: CreateUserDto): Promise<AuthResponse> {
    const existing = await User.query().findOne({ username: dto.username });
    if (existing) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const user = await User.query().insertAndFetch({
      id: randomUUID(),
      username: dto.username,
      password: hashedPassword,
      role: dto.role as Role,
    });

    const safeUser = this.toSafeUser(user);
    const access_token = this.signToken(safeUser);
    return { user: safeUser, access_token };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await User.query().findOne({ username: dto.username });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const safeUser = this.toSafeUser(user);
    const access_token = this.signToken(safeUser);
    return { user: safeUser, access_token };
  }

  async validateUserById(id: string): Promise<SafeUser | null> {
    const user = await User.query().findById(id);
    return user ? this.toSafeUser(user) : null;
  }

  signToken(user: SafeUser): string {
    const payload: AuthPayload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  private toSafeUser(user: {
    id: string;
    username: string;
    role: Role;
  }): SafeUser {
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
