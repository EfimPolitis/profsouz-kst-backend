import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.application.findMany({
      select: {
        id: true,
        user: true,
        event: true,
        ticketsCount: true,
        status: true,
        createdAt: true,
      },
    });
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
    return this.prisma.application.create({
      data: {
        userId,
        eventId,
        ticketsCount,
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
