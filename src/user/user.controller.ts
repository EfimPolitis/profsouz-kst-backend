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
  async getProfile(@CurrentUser('id') UserID: string) {
    return this.userService.getProfile(UserID);
  }

  @Auth('ADMIN')
  @Get('?')
  async search(@Query() dto: string) {
    console.log(dto);
    return this.userService.searchUser(dto);
  }

  @Auth('ADMIN')
  @Get()
  async getList() {
    return this.userService.getUsers();
  }

  @Auth('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
