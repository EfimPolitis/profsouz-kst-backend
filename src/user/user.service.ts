import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import {
  EnumSortType,
  EnumUserSort,
  getAllUsersDto,
} from './dto/get-all.user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(dto: getAllUsersDto) {
    const { search, sort, type, page } = dto;

    const prismaSort: Prisma.UserOrderByWithAggregationInput[] = [];

    if (sort === EnumUserSort.ALPHABETIC && type === EnumSortType.ASK)
      prismaSort.push({ role: 'asc' });
    else if (sort === EnumUserSort.ALPHABETIC && type === EnumSortType.DESC)
      prismaSort.push({ role: 'desc' });
    else if (sort === EnumUserSort.DATE && type === EnumSortType.ASK)
      prismaSort.push({ createdAt: 'asc' });
    else if (sort === EnumUserSort.DATE && type === EnumSortType.DESC)
      prismaSort.push({ createdAt: 'desc' });

    const prismaSearch: Prisma.UserWhereInput = search
      ? {
          OR: [
            {
              userName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              middleName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const skip = Number(page) > 1 ? (Number(page) - 1) * 12 : 0;
    const data = await this.prisma.user.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
    });
    const countPage =
      Math.ceil(data.length / 12) > 1 ? Math.ceil(data.length / 12) : 0;

    const items = await this.prisma.user.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
      skip,
      take: 12,
    });

    return {
      items,
      countPage,
    };
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

  async update(dto: CreateUserDto, id: string) {
    return this.prisma.user.update({
      where: {
        userId: id,
      },
      data: dto,
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
