import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.category.findMany();
  }

  async create(dto: CreateCategoryDto) {
    const { name, color } = dto;
    return this.prisma.category.create({
      data: { name, color },
    });
  }

  async update(id: string, dto: CreateCategoryDto) {
    const { name, color } = dto;
    return this.prisma.category.update({
      where: { id },
      data: { name, color },
    });
  }

  async delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
