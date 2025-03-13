import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { getManyNewsDto } from './dto/get-all-news.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import * as fs from 'fs';
import * as path from 'path';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  getNews(@Query() dto: getManyNewsDto) {
    return this.newsService.findMany(dto);
  }

  @Post('views/:newsId')
  updateView(@Param('newsId') newsId: string) {
    return this.newsService.updateView(newsId);
  }

  @Get(':newsId')
  getNewsById(@Param('newsId') newsId: string) {
    if (!newsId) throw new BadRequestException('Bad request');
    return this.newsService.findById(newsId);
  }

  @Auth('MODER')
  @Post()
  create(@Body() dto: CreateNewsDto) {
    return this.newsService.create(dto);
  }

  @Auth('MODER')
  @Patch(':newsId')
  update(@Param('newsId') newsId: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(newsId, dto);
  }

  @Auth('MODER')
  @Delete(':newsId')
  remove(@Param('newsId') newsId: string) {
    return this.newsService.remove(newsId);
  }

  @Auth('MODER')
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/uploads/news',
        filename: (req, image, cb) => {
          cb(null, image.originalname);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    return this.newsService.uploadImage(image);
  }

  @Auth('MODER')
  @Delete('image/:filename')
  async deleteImage(@Param('filename') filename: string) {
    const imagePath = path.join(
      __dirname,
      '../../public/uploads/news',
      filename,
    );

    // Проверяем, существует ли файл
    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Файл не найден');
    }

    // Удаляем путь картинки из базы данных
    const boolean = await this.newsService.deleteImage(filename);

    // Удаляем файл
    if (boolean) fs.unlinkSync(imagePath);

    return HttpCode(200);
  }
}
