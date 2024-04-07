import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth('')
  @Get()
  async getCategories() {
    return this.categoryService.getAll();
  }

  @Auth('ADMIN')
  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Auth('ADMIN')
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: CreateCategoryDto,
  ) {
    console.log(id);
    return this.categoryService.update(id, dto);
  }

  @Auth('ADMIN')
  @Delete(':id')
  async deleteCategroy(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
