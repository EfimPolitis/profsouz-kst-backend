import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { Prisma } from '@prisma/client';
import {
  EnumApplicationSort,
  EnumSortOrder,
  getAllApplicationsDto,
} from './dto/get-all-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(dto: getAllApplicationsDto) {
    const { search, sort, order, page, created_at_start, created_at_end } = dto;

    const { prismaSort } = this._getSort(sort, order);
    const { prismaSearch } = this._getSearch(search);
    const { prismaFilter } = this._getFilter(created_at_start, created_at_end);

    const skip = Number(page) > 1 ? (Number(page) - 1) * 10 : 0;

    const countApplications = await this.prisma.application.count({
      where: {
        AND: [prismaSearch, prismaFilter],
      },
    });
    const countPage =
      Math.ceil(countApplications / 10) > 1
        ? Math.ceil(countApplications / 10)
        : 0;

    const data = await this.prisma.application.findMany({
      where: {
        AND: [prismaSearch, prismaFilter],
      },
      orderBy: prismaSort,
      select: {
        id: true,
        events: true,
        user: true,
        places: true,
        createdAt: true,
      },
      skip,
      take: 10,
    });

    return {
      items: data,
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
        places: true,
        id: false,
        createdAt: false,
      },
    });
  }

  async getByUserId(userId: number) {
    return this.prisma.application.findMany({
      where: {
        userId,
      },
    });
  }

  async create(dto: CreateApplicationDto) {
    const { userId, eventId, places } = dto;

    await this.prisma.event.update({
      where: { eventId },
      data: {
        places: {
          decrement: places,
        },
      },
    });

    await this.prisma.application.create({
      data: {
        userId,
        eventId,
        places,
      },
    });

    return true;
  }

  async delete(id: string) {
    return this.prisma.application.delete({
      where: {
        id,
      },
    });
  }

  private _getSort(sort: EnumApplicationSort, order: EnumSortOrder) {
    const prismaSort: Prisma.ApplicationOrderByWithAggregationInput[] = [];

    if (sort === EnumApplicationSort.CREATED_AT && order === EnumSortOrder.ASK)
      prismaSort.push({ createdAt: 'asc' });
    else if (
      sort === EnumApplicationSort.CREATED_AT &&
      order === EnumSortOrder.DESC
    )
      prismaSort.push({ createdAt: 'desc' });

    return { prismaSort };
  }

  private _getSearch(search: string) {
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

    return { prismaSearch };
  }

  private _getFilter(created_at_start: string, created_at_end: string) {
    const prismaFilter: Prisma.ApplicationWhereInput = {};

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

    return { prismaFilter };
  }
}
