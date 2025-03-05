import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { getAllEventsDto } from './dto/get-all-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvents(@Query() dto: getAllEventsDto) {
    return this.eventService.findMany(dto);
  }

  @Get(':id')
  async getEventsById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Bad request');
    return this.eventService.findById(id);
  }

  @Auth('MODER')
  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Auth('MODER')
  @Patch(':id')
  async updateEvent(@Body() dto: UpdateEventDto, @Param('id') eventId: string) {
    return this.eventService.update(dto, eventId);
  }

  @Auth('MODER')
  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.delete(id);
  }

  @Auth('MODER')
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/uploads/event',
        filename: (req, image, cb) => {
          cb(null, image.originalname);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    return this.eventService.uploadImage(image);
  }

  @Auth('MODER')
  @Delete('image/:filename')
  async deleteImage(@Param('filename') filename: string) {
    const imagePath = path.join(
      __dirname,
      '../../public/uploads/event',
      filename,
    );

    // Проверяем, существует ли файл
    if (!fs.existsSync(imagePath)) {
      throw new NotFoundException('Файл не найден');
    }

    // Удаляем файл
    fs.unlinkSync(imagePath);

    // Удаляем путь картинки из базы данных
    this.eventService.deleteImage(filename);

    return HttpCode(200);
  }
}
