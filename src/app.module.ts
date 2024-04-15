import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { ApplicationModule } from './application/application.module';
import { CommentModule } from './comment/comment.module';
import { ReportModule } from './report/report.module';
import { CategoryModule } from './category/category.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    EventModule,
    ApplicationModule,
    CommentModule,
    ReportModule,
    CategoryModule,
    ReservationModule,
  ],
})
export class AppModule {}
