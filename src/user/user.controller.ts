import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { getAllUsersDto } from './dto/get-all.user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReportService } from 'src/report/report.service';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly reportService: ReportService,
  ) {}

  @Auth('')
  @Get('profile')
  async getProfile(@CurrentUser('userId') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Auth('ADMIN')
  @Get('report')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async downloadReport(@Res() res: Response) {
    let buffer = await this.reportService.generateUserReport();
    let fileName = `user_report_${new Date(Date.now()).toISOString().slice(0, -14)}`;

    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${fileName}`,
    );
    res.send(buffer);
  }

  @Auth('ADMIN')
  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getById(userId);
  }

  @Auth('MODER')
  @Get()
  async getUsers(@Query() dto: getAllUsersDto) {
    return this.userService.getAll(dto);
  }

  @Auth('ADMIN')
  @Patch(':userId')
  async updateUser(
    @Body() dto: UpdateUserDto,
    @Param('userId') userId: string,
  ) {
    return this.userService.update(dto, userId);
  }

  @Auth('ADMIN')
  @Delete(':id')
  async delete(@Param('id') userId: string) {
    return this.userService.delete(userId);
  }
}
