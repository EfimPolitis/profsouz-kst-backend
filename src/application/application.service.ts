import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { EStatus, Prisma } from '@prisma/client';
import {
  EnumApplicationSort,
  EnumSortType,
  getAllApplicationsDto,
} from './dto/get-all-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(dto: getAllApplicationsDto) {
    const { search, sort, type, page } = dto;

    const prismaSort: Prisma.ApplicationOrderByWithAggregationInput[] = [];

    if (sort === EnumApplicationSort.ALPHABETIC && type === EnumSortType.ASK)
      prismaSort.push({ status: 'asc' });
    else if (
      sort === EnumApplicationSort.ALPHABETIC &&
      type === EnumSortType.DESC
    )
      prismaSort.push({ status: 'desc' });
    else if (sort === EnumApplicationSort.DATE && type === EnumSortType.ASK)
      prismaSort.push({ createdAt: 'asc' });
    else if (sort === EnumApplicationSort.DATE && type === EnumSortType.DESC)
      prismaSort.push({ createdAt: 'desc' });

    const prismaSearch: Prisma.ApplicationWhereInput = search
      ? {
          OR: [
            {
              user: {
                OR: [
                  {
                    firstName: {
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
                    middleName: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
            },
            {
              events: {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        }
      : {};

    const skip = Number(page) > 1 ? (Number(page) - 1) * 12 : 0;
    const data = await this.prisma.application.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
    });
    const countPage =
      Math.ceil(data.length / 12) > 1 ? Math.ceil(data.length / 12) : 0;

    const items = await this.prisma.application.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
      select: {
        id: true,
        events: true,
        user: true,
        status: true,
        ticketsCount: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: 12,
    });

    return {
      items,
      countPage,
    };
  }

  async getById(id: string) {
    return this.prisma.application.findUnique({
      where: {
        id,
      },
      select: {
        eventId: true,
        userId: true,
        ticketsCount: true,
        id: false,
        createdAt: false,
      },
    });
  }

  async getByUserId(userId: string) {
    return this.prisma.application.findMany({
      where: {
        userId,
      },
    });
  }

  async create(dto: CreateApplicationDto) {
    const { userId, eventId, ticketsCount } = dto;

    await this.prisma.application.create({
      data: {
        userId,
        eventId,
        ticketsCount,
      },
    });

    return true;
  }

  async update(status: EStatus, id: string) {
    return this.prisma.application.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.application.delete({
      where: {
        id,
      },
    });
  }
}
