import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { ReportService } from 'src/report/report.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ReportService, PrismaService],
})
export class UserModule {}
