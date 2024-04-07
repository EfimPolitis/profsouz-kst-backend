import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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

  @Auth('')
  @Get()
  async getEvents(@Query() dto: getAllEventsDto) {
    return this.eventService.getAll(dto);
  }

  @Auth('ADMIN')
  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    return this.eventService.create(dto);
  }

  @Auth('ADMIN')
  @Post()
  async updateEvent(@Body() dto: UpdateEventDto) {
    return this.eventService.update(dto);
  }

  @Auth('ADMIN')
  @Delete(':id')
  async deleteEvent(@Param('id') id: string) {
    return this.eventService.delete(id);
  }
}
