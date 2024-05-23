import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { getAllEventsDto } from './dto/get-all.event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getEvents(@Query() dto: getAllEventsDto) {
    return this.eventService.getAll(dto);
  }

  @Get(':id')
  async getEventsById(@Param('id') id: string) {
    if (!id) throw new BadRequestException('Bad request');
    return this.eventService.getById(id);
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
  async deleteEvent(@Param('id') eventId: string) {
    return this.eventService.delete(eventId);
  }
}
