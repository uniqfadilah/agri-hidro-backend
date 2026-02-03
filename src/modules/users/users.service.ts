import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../../models';
import { UpdatePasswordDto } from './dto/update-password.dto';

export type UserListItem = {
  id: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor() {}

  async findAll(): Promise<UserListItem[]> {
    const rows = await User.query()
      .select('id', 'username', 'role', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');
    return rows as UserListItem[];
  }

  async delete(id: string): Promise<void> {
    const user = await User.query().findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await User.query().deleteById(id);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
    const user = await User.query().findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    await User.query().patchAndFetchById(userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });
  }
}
