import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaService } from 'src/prisma.service';
import { ReportService } from 'src/report/report.service';

@Module({
  controllers: [EventController],
  providers: [EventService, ReportService, PrismaService],
})
export class EventModule {}
