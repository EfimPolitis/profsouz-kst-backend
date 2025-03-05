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
import { UpdateUserDto } from './dto/update-user.dto';

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

    const skip = Number(page) > 1 ? (Number(page) - 1) * 10 : 0;
    const data = await this.prisma.user.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
    });
    const countPage =
      Math.ceil(data.length / 10) > 1 ? Math.ceil(data.length / 10) : 0;

    const items = await this.prisma.user.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
      skip,
      take: 10,
    });

    return {
      items,
      countPage,
    };
  }

  async getProfile(userId: number) {
    const profile = await this.getById(userId);
    const { password, ...rest } = profile;

    return rest;
  }

  async getById(userId: number) {
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
    const { password, ...data } = dto;

    return this.prisma.user.create({
      data: {
        ...data,
        password: await hash(password),
      },
    });
  }

  async update(dto: UpdateUserDto, id: number) {
    const { password, ...data } = dto;

    return this.prisma.user.update({
      where: {
        userId: id,
      },
      data:
        password !== ''
          ? {
              ...data,
              password: await hash(password),
            }
          : data,
    });
  }

  async delete(userId: number) {
    return this.prisma.user.delete({
      where: {
        userId,
      },
    });
  }
}
