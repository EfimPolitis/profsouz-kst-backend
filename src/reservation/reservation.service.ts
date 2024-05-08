import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.reservationList.findMany({
      select: {
        id: true,
        events: true,
        user: true,
        ticketsCount: true,
        createdAt: true,
      },
    });
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
    return this.prisma.reservationList.create({
      data: {
        userId,
        eventId,
        ticketsCount,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.reservationList.delete({
      where: {
        id,
      },
    });
  }
}
