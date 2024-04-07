import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.categories.findMany();
  }

  async create(dto: CreateCategoryDto) {
    const { name } = dto;
    return this.prisma.categories.create({
      data: { name },
    });
  }

  async update(id: string, dto: CreateCategoryDto) {
    const { name } = dto;
    return this.prisma.categories.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: string) {
    return this.prisma.categories.delete({
      where: { id },
    });
  }
}
