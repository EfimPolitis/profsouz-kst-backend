import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ReservationService } from 'src/reservation/reservation.service';
import { getAllApplicationsDto } from './dto/get-all-application.dto';

@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly reservationService: ReservationService,
  ) {}

  @Auth('MODER')
  @Get()
  async getAllApplication(@Query() dto: getAllApplicationsDto) {
    return this.applicationService.getAll(dto);
  }

  @Auth('USER')
  @Get(':userId')
  async getUserApplication(@Param('userId') userId: string) {
    return this.applicationService.getByUserId(userId);
  }

  @Auth('')
  @Post()
  async createApplication(@Body() dto: CreateApplicationDto) {
    return this.applicationService.create(dto);
  }

  @Auth('MODER')
  @Patch(':id')
  async updateApplication(@Body() dto, @Param('id') id: string) {
    if (dto.status === 'APPROVED') {
      const application = await this.applicationService.getById(id);
      this.reservationService.create(application);
    }

    this.applicationService.update(dto.status, id);

    return true;
  }
}
