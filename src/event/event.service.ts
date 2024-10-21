import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma } from '@prisma/client';
import {
  EnumEventSort,
  EnumEventType,
  EnumSortOrder,
  getAllEventsDto,
} from './dto/get-all.event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getAll(dto: getAllEventsDto) {
    const { search, sort, order, page, date_start, date_end, type } = dto;

    const { prismaSort } = this._getSort(sort, order);
    const { prismaSearch } = this._getSearch(search);
    const { prismaFilter } = this._getFilter(date_start, date_end, type);

    const skip = Number(page) > 1 ? (Number(page) - 1) * 12 : 0;
    const countEvents = await this.prisma.event.count();
    const countPage =
      Math.ceil(countEvents / 10) > 1 ? Math.ceil(countEvents / 10) : 0;

    let events = await this.prisma.event.findMany({
      where: {
        AND: [prismaSearch, prismaFilter],
      },
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
                name: true,
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
      items: events.map((event) => {
        const categories = event.categories.map(({ category }) => category);
        const images = event.images.map(({ image }) => image);
        return {
          ...event,
          categories,
          images,
        };
      }),
      countPage,
    };
  }

  async getById(id: string) {
    const event = await this.prisma.event.findUnique({
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

    return {
      ...event,
      categories: event.categories.map(({ category }) => category),
      images: event.images.map(({ image }) => image),
    };
  }

  async create(dto: CreateEventDto) {
    let {
      title,
      description,
      organizer,
      link,
      date,
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

    date = new Date(date).toISOString();

    return this.prisma.event.create({
      data: {
        title,
        description,
        organizer,
        link,
        date,
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
    let {
      title,
      description,
      organizer,
      link,
      date,
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

    date = new Date(date).toISOString();

    return this.prisma.event.update({
      where: {
        eventId,
      },
      data: {
        title,
        description,
        organizer,
        link,
        date,
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
    return this.prisma.event.delete({
      where: {
        eventId,
      },
    });
  }

  private _getSort(sort: EnumEventSort, order: EnumSortOrder) {
    const prismaSort: Prisma.EventOrderByWithAggregationInput[] = [];

    if (sort === EnumEventSort.ALPHABETIC && order === EnumSortOrder.ASK)
      prismaSort.push({ title: 'asc' });
    else if (sort === EnumEventSort.ALPHABETIC && order === EnumSortOrder.DESC)
      prismaSort.push({ title: 'desc' });
    else if (sort === EnumEventSort.DATE && order === EnumSortOrder.ASK)
      prismaSort.push({ date: 'asc' });
    else if (sort === EnumEventSort.DATE && order === EnumSortOrder.DESC)
      prismaSort.push({ date: 'desc' });
    else if (sort === EnumEventSort.TICKETS && order === EnumSortOrder.ASK)
      prismaSort.push({ totalTickets: 'asc' });
    else if (sort === EnumEventSort.TICKETS && order === EnumSortOrder.DESC)
      prismaSort.push({ totalTickets: 'desc' });

    return { prismaSort };
  }

  private _getSearch(search: string) {
    const prismaSearch: Prisma.EventWhereInput = search
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

    return { prismaSearch };
  }

  private _getFilter(
    date_start: string,
    date_end: string,
    type: EnumEventType,
  ) {
    const prismaFilter: Prisma.EventWhereInput = {};

    if (date_start) {
      prismaFilter.date = {
        gte: new Date(date_start),
      };
    }
    if (date_end) {
      prismaFilter.date = {
        lte: new Date(date_end),
      };
    }
    if (type) {
      const withLink = type === 'link';

      prismaFilter.link = withLink ? { not: '' } : '';
    }

    return { prismaFilter };
  }
}
