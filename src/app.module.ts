import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { ApplicationModule } from './application/application.module';
import { CategoryModule } from './category/category.module';
import { ReservationModule } from './reservation/reservation.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { NewsModule } from './news/news.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    EventModule,
    ApplicationModule,
    CategoryModule,
    ReservationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    NewsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
