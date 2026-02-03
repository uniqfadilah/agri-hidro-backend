import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import type { SafeUser } from '../auth/auth.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import type { UserListItem } from './users.service';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  findAll(): Promise<UserListItem[]> {
    return this.usersService.findAll();
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: 'User deleted' };
  }

  @Patch('me/password')
  async updateOwnPassword(
    @CurrentUser() currentUser: SafeUser,
    @Body() dto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.updatePassword(currentUser.id, dto);
    return { message: 'Password updated' };
  }
}
