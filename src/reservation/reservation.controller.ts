import { Body, Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { getAllReservationDto } from './dto/get-all-reservations.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Auth('MODER')
  @Get()
  async getReservations(@Query() dto: getAllReservationDto) {
    return this.reservationService.getAll(dto);
  }

  @Auth('USER')
  @Get(':userId')
  async getReservationsByUserId(@Param('userId') userId: string) {
    return this.reservationService.getByUserId(userId);
  }

  @Auth('MODER')
  @Delete(':id')
  async deleteReservation(@Param('id') id: string) {
    return this.reservationService.delete(id);
  }
}
