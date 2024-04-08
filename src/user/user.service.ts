import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        userName: true,
        firstName: true,
        lastName: true,
        middleName: true,
        email: true,
        userId: true,
        role: true,
        createdAt: true,
        password: false,
      },
    });
  }

  async searchUser(dto) {
    const prismaSearch: Prisma.UserWhereInput = dto.search
      ? {
          userName: {
            contains: dto.search,
            mode: 'insensitive',
          },
        }
      : {};

    const users = this.prisma.user.findMany({
      where: prismaSearch,
    });

    return users;
  }

  async getProfile(userId: string) {
    const profile = await this.getById(userId);
    const { password, ...rest } = profile;

    return rest;
  }

  async getById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        userId,
      },
    });
  }

  async getByUserName(userName: string) {
    return this.prisma.user.findUnique({
      where: {
        userName,
      },
    });
  }

  async create(dto: CreateUserDto) {
    const { userName, firstName, lastName, middleName, email, password, role } =
      dto;

    return this.prisma.user.create({
      data: {
        userName,
        firstName,
        lastName,
        middleName,
        email,
        password: await hash(password),
        role,
      },
    });
  }

  async delete(userId: string) {
    return this.prisma.user.delete({
      where: {
        userId,
      },
    });
  }
}
