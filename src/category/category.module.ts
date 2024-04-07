import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma.service';
import { CategoryListService } from './categoryList.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, CategoryListService],
})
export class CategoryModule {}
