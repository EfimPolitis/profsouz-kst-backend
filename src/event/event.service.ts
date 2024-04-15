import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma } from '@prisma/client';
import {
  EnumEventSort,
  EnumSortType,
  getAllEventsDto,
} from './dto/get-all.event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getAll(dto: getAllEventsDto) {
    const { search, sort, type } = dto;

    const prismaSort: Prisma.EventOrderByWithAggregationInput[] = [];

    if (sort === EnumEventSort.ALPHABETIC && type === EnumSortType.ASK)
      prismaSort.push({ title: 'asc' });
    else if (sort === EnumEventSort.ALPHABETIC && type === EnumSortType.DESC)
      prismaSort.push({ title: 'desc' });
    // else if (sort === EnumEventSort.CATEGORY && type === EnumSortType.DESC)
    //   prismaSort.push({ title: 'desc'})
    // else if (sort === EnumEventSort.CATEGORY && type === EnumSortType.DESC)
    //   prismaSort.push({ title: 'desc'})
    else if (sort === EnumEventSort.DATE && type === EnumSortType.ASK)
      prismaSort.push({ date: 'asc' });
    else if (sort === EnumEventSort.DATE && type === EnumSortType.DESC)
      prismaSort.push({ date: 'desc' });

    const prismaSearch: Prisma.EventWhereInput = search
      ? {
          OR: [
            // {
            //   category: {
            //     contains: search,
            //     mode: 'insensitive',
            //   },
            // },
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    return this.prisma.event.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
      include: {
        categories: {
          select: {
            category: true,
          },
        },
      },
    });
  }

  async create(dto: CreateEventDto) {
    const {
      title,
      description,
      imageUrl,
      link,
      date,
      categoryId,
      totalTickets,
    } = dto;

    const categories = [];

    for (let i = 0; i <= categoryId.length - 1; i++) {
      categories.push({
        category: {
          connect: {
            id: categoryId[i],
          },
        },
      });
    }

    return this.prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        link,
        date,
        totalTickets,
        categories: {
          create: categories,
        },
      },
    });
  }

  async update(dto: UpdateEventDto) {
    const {
      eventId,
      title,
      description,
      imageUrl,
      link,
      date,
      categoryId,
      totalTickets,
    } = dto;

    return this.prisma.event.update({
      where: {
        eventId,
      },
      data: {
        title,
        description,
        imageUrl,
        link,
        date,
        totalTickets,
      },
    });
  }

  async delete(eventId: string) {
    return this.prisma.event.delete({
      where: {
        eventId,
      },
    });
  }
}
