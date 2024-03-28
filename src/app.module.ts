import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { RequestModule } from './request/request.module';
import { BookingModule } from './booking/booking.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, EventModule, RequestModule, BookingModule, CommentModule, ReportModule],
})
export class AppModule {}
