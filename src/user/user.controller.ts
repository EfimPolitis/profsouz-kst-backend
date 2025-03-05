import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { getAllUsersDto } from './dto/get-all.user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth('')
  @Get('profile')
  async getProfile(@CurrentUser('userId') userId: number) {
    return this.userService.getProfile(userId);
  }

  @Auth('ADMIN')
  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @Auth('MODER')
  @Get()
  async getUsers(@Query() dto: getAllUsersDto) {
    return this.userService.getAll(dto);
  }

  @Auth('ADMIN')
  @Patch(':id')
  async updateUser(@Body() dto: UpdateUserDto, @Param('id') id: number) {
    return this.userService.update(dto, id);
  }

  @Auth('ADMIN')
  @Delete(':id')
  async delete(@Param('id') userId: number) {
    return this.userService.delete(userId);
  }
}
