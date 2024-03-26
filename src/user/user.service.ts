import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        UserName: true,
        Email: true,
        UserID: true,
        Password: false,
      },
    });
  }

  async getById(UserID: string) {
    return this.prisma.user.findUnique({
      where: {
        UserID,
      },
    });
  }

  async getByUserName(UserName: string) {
    return this.prisma.user.findUnique({
      where: {
        UserName,
      },
    });
  }

  async create(dto: CreateUserDto) {
    const user = {
      Email: dto.Email,
      UserName: dto.UserName,
      Password: await hash(dto.Password),
      UserRole: dto?.UserRole,
    };

    return this.prisma.user.create({
      data: user,
    });
  }

  async delete(UserID: string) {
    return this.prisma.user.delete({
      where: {
        UserID,
      },
    });
  }
}
