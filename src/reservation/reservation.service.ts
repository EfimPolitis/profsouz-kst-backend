import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Prisma } from '@prisma/client';
import {
  EnumReservationSort,
  EnumSortType,
  getAllReservationDto,
} from './dto/get-all-reservations.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(dto: getAllReservationDto) {
    const { search, sort, type, page } = dto;

    const prismaSort: Prisma.ReservationListOrderByWithAggregationInput[] = [];

    // if (sort === EnumReservationSort.ALPHABETIC && type === EnumSortType.ASK)
    //   prismaSort.push({ status: 'asc' });
    // else if (
    //   sort === EnumReservationSort.ALPHABETIC &&
    //   type === EnumSortType.DESC
    // )
    //   prismaSort.push({ status: 'desc' });
    // else if (sort === EnumReservationSort.DATE && type === EnumSortType.ASK)
    //   prismaSort.push({ createdAt: 'asc' });
    // else if (sort === EnumReservationSort.DATE && type === EnumSortType.DESC)
    //   prismaSort.push({ createdAt: 'desc' });

    const prismaSearch: Prisma.ReservationListWhereInput = search
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
    const data = await this.prisma.reservationList.findMany({
      where: prismaSearch,
      orderBy: prismaSort,
    });
    const countPage =
      Math.ceil(data.length / 12) > 1 ? Math.ceil(data.length / 12) : 0;

    const items = await this.prisma.reservationList.findMany({
      where: prismaSearch,
      select: {
        id: true,
        events: true,
        user: true,
        ticketsCount: true,
        createdAt: true,
      },
      skip,
      take: 12,
    });

    return {
      items,
      countPage,
    };
  }

  async getByUserId(userId: string) {
    return this.prisma.reservationList.findMany({
      where: {
        userId,
      },
      select: {
        id: false,
        user: false,
        userId: false,
        eventId: false,
        ticketsCount: true,
        events: {
          include: {
            categories: {
              select: {
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async create(dto: CreateReservationDto) {
    const { userId, eventId, ticketsCount } = dto;

    let { totalTickets } = await this.prisma.events.findUnique({
      where: {
        eventId,
      },
      select: {
        totalTickets: true,
      },
    });

    totalTickets -= ticketsCount;

    await this.prisma.events.update({
      where: { eventId },
      data: {
        totalTickets,
      },
    });

    await this.prisma.reservationList.create({
      data: {
        userId,
        eventId,
        ticketsCount,
      },
    });

    return true;
  }

  async delete(id: string) {
    return this.prisma.reservationList.delete({
      where: {
        id,
      },
    });
  }
}
