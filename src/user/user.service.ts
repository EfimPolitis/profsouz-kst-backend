import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { EUserRole, Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { EnumUserSort, getAllUsersDto } from './dto/get-all.user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(dto: getAllUsersDto) {
    const {
      search,
      sort,
      page,
      created_at_start,
      created_at_end,
      updated_at_start,
      updated_at_end,
      role,
    } = dto;

    const { prismaSort } = this._getSort(sort);
    const { prismaSearch } = this._getSearch(search);
    const { prismaFilter } = this._getFilter(
      created_at_start,
      created_at_end,
      updated_at_start,
      updated_at_end,
      role,
    );

    const skip = Number(page) > 1 ? (Number(page) - 1) * 10 : 0;
    const data = await this.prisma.user.findMany({
      where: { AND: [prismaSearch, prismaFilter] },
      orderBy: prismaSort,
    });
    const countPage =
      Math.ceil(data.length / 10) > 1 ? Math.ceil(data.length / 10) : 0;

    const items = await this.prisma.user.findMany({
      where: { AND: [prismaSearch, prismaFilter] },
      orderBy: prismaSort,
      skip,
      take: 10,
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
    const { password, ...data } = dto;

    return this.prisma.user.create({
      data: {
        ...data,
        password: await hash(password),
      },
    });
  }

  async update(dto: UpdateUserDto, userId: string) {
    const { password, ...data } = dto;

    return this.prisma.user.update({
      where: {
        userId,
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

  async delete(userId: string) {
    return this.prisma.user.delete({
      where: {
        userId,
      },
    });
  }

  private _getSort(sort: EnumUserSort) {
    const prismaSort: Prisma.UserOrderByWithAggregationInput[] = [];

    if (sort === EnumUserSort.ALPHABETIC_ASC) prismaSort.push({ role: 'asc' });
    else if (sort === EnumUserSort.ALPHABETIC_DESC)
      prismaSort.push({ role: 'desc' });
    else if (sort === EnumUserSort.CREATED_AT_ASC)
      prismaSort.push({ createdAt: 'asc' });
    else if (sort === EnumUserSort.CREATED_AT_DESC)
      prismaSort.push({ createdAt: 'desc' });
    else if (sort === EnumUserSort.UPDATED_AT_ASC)
      prismaSort.push({ createdAt: 'asc' });
    else if (sort === EnumUserSort.UPDATED_AT_DESC)
      prismaSort.push({ createdAt: 'desc' });

    return { prismaSort };
  }

  private _getSearch(search: string) {
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

    return { prismaSearch };
  }

  private _getFilter(
    created_at_start: string,
    created_at_end: string,
    updated_at_start: string,
    updated_at_end: string,
    role: EUserRole,
  ) {
    const prismaFilter: Prisma.UserWhereInput = {};

    if (created_at_start) {
      prismaFilter.createdAt = {
        gte: new Date(created_at_start),
      };
    }
    if (created_at_end) {
      prismaFilter.createdAt = {
        lte: new Date(created_at_end),
      };
    }
    if (updated_at_start) {
      prismaFilter.updatedAt = {
        gte: new Date(created_at_start),
      };
    }
    if (updated_at_end) {
      prismaFilter.updatedAt = {
        lte: new Date(created_at_end),
      };
    }
    if (role) {
      prismaFilter.role = {
        equals: role,
      };
    }

    return { prismaFilter };
  }
}
