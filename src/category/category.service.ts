import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { getAllCategoriesDto } from './dto/get-all-categories.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(dto: getAllCategoriesDto) {
    const { search } = dto;

    return this.prisma.category.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });
  }

  async create(dto: CreateCategoryDto) {
    const { name } = dto;
    return this.prisma.category.create({
      data: { name },
    });
  }

  async update(id: string, dto: CreateCategoryDto) {
    const { name } = dto;
    return this.prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
