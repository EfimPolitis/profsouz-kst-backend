import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaService } from 'src/prisma.service';
import { ReservationService } from 'src/reservation/reservation.service';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, PrismaService, ReservationService],
})
export class ApplicationModule {}
