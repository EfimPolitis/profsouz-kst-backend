import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { PrismaService } from 'src/prisma.service';
import { ReportService } from 'src/report/report.service';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService, ReportService, PrismaService],
})
export class ApplicationModule {}
