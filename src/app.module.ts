import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { BookingModule } from './reservation/booking.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    EventModule,
    BookingModule,
    CommentModule,
    ReportModule,
    CategoryModule,
  ],
})
export class AppModule {}
