import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.getById(id);
  }

  @Auth('ADMIN')
  @Get()
  async getList() {
    return this.userService.getUsers();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
