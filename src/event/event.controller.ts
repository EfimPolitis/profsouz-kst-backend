import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
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
import { Response } from 'express';
import { ReportService } from 'src/report/report.service';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly reportService: ReportService,
  ) {}

  @Auth('')
  @Get()
  async getEvents(@Query() dto: getAllEventsDto) {
    return this.eventService.findMany(dto);
  }

  @Auth('MODER')
  @Get('report')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async downloadReport(@Res() res: Response) {
    let buffer = await this.reportService.generateEventReport();
    let fileName = `event_report_${new Date(Date.now()).toISOString().slice(0, -14)}`;

    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${fileName}`,
    );
    res.send(buffer);
  }

  @Auth('')
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

    // Удаляем путь картинки из базы данных
    const boolean = await this.eventService.deleteImage(filename);

    // Удаляем файл
    if (boolean) fs.unlinkSync(imagePath);

    return HttpCode(200);
  }
}
