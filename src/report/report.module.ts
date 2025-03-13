import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReportService } from './report.service';

@Module({
  providers: [ReportService, PrismaService],
})
export class UserModule {}
