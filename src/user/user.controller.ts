import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth('')
  @Get('profile')
  async getProfile(@CurrentUser('userId') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Auth('ADMIN')
  @Get()
  async search(@Query() dto: string) {
    return this.userService.searchUser(dto);
  }

  @Auth('ADMIN')
  @Get()
  async getList() {
    return this.userService.getUsers();
  }

  @Auth('ADMIN')
  @Delete(':id')
  async delete(@Param('id') userId: string) {
    return this.userService.delete(userId);
  }
}
