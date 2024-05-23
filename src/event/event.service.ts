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
    const { search, sort, type, page } = dto;

    const prismaSort: Prisma.EventsOrderByWithAggregationInput[] = [];

    if (sort === EnumEventSort.ALPHABETIC && type === EnumSortType.ASK)
      prismaSort.push({ title: 'asc' });
    else if (sort === EnumEventSort.ALPHABETIC && type === EnumSortType.DESC)
      prismaSort.push({ title: 'desc' });
    else if (sort === EnumEventSort.DATE && type === EnumSortType.ASK)
      prismaSort.push({ eventDate: 'asc' });
    else if (sort === EnumEventSort.DATE && type === EnumSortType.DESC)
      prismaSort.push({ eventDate: 'desc' });

    const prismaSearch: Prisma.EventsWhereInput = search
      ? {
          OR: [
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
            {
              categories: {
                some: {
                  category: {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
          ],
        }
      : {};

    const skip = Number(page) > 1 ? (Number(page) - 1) * 12 : 0;
    const data = await this.prisma.events.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
    });
    const countPage =
      Math.ceil(data.length / 12) > 1 ? Math.ceil(data.length / 12) : 0;

    const items = await this.prisma.events.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
      include: {
        categories: {
          select: {
            category: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        images: {
          select: {
            image: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
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
    return this.prisma.events.findUnique({
      where: { eventId: id },
      include: {
        categories: {
          select: {
            category: true,
          },
        },
        images: {
          select: {
            image: true,
          },
        },
      },
    });
  }

  async create(dto: CreateEventDto) {
    const {
      title,
      description,
      organizer,
      link,
      eventDate,
      imagesId,
      categoriesId,
      totalTickets,
    } = dto;

    const categories = [];
    const images = [];

    for (let i = 0; i <= categoriesId.length - 1; i++) {
      categories.push({
        category: {
          connect: {
            id: categoriesId[i],
          },
        },
      });
    }

    for (let i = 0; i <= imagesId.length - 1; i++) {
      images.push({
        image: {
          connect: {
            id: imagesId[i],
          },
        },
      });
    }

    return this.prisma.events.create({
      data: {
        title,
        description,
        organizer,
        link,
        eventDate,
        totalTickets,
        categories: {
          create: categories,
        },
        images: {
          create: images,
        },
      },
    });
  }

  async update(dto: UpdateEventDto, eventId: string) {
    const {
      title,
      description,
      organizer,
      link,
      eventDate,
      imagesId,
      categoriesId,
      totalTickets,
    } = dto;

    const categories = [];
    const images = [];

    for (let i = 0; i <= categoriesId.length - 1; i++) {
      categories.push({
        category: {
          connect: {
            id: categoriesId[i],
          },
        },
      });
    }

    for (let i = 0; i <= imagesId.length - 1; i++) {
      images.push({
        image: {
          connect: {
            id: imagesId[i],
          },
        },
      });
    }

    return this.prisma.events.update({
      where: {
        eventId,
      },
      data: {
        title,
        description,
        organizer,
        link,
        eventDate,
        totalTickets,
        categories: {
          deleteMany: {
            eventId,
          },
          create: categories,
        },
        images: {
          deleteMany: {
            eventId,
          },
          create: images,
        },
      },
    });
  }

  async delete(eventId: string) {
    return this.prisma.events.delete({
      where: {
        eventId,
      },
    });
  }
}
