import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Auth('ADMIN')
  @Get()
  async getReservations() {
    return this.reservationService.getAll();
  }

  @Auth('USER')
  @Get(':userId')
  async getReservationsByUserId(@Param('userId') userId: string) {
    return this.reservationService.getByUserId(userId);
  }

  @Auth('ADMIN')
  @Delete(':id')
  async deleteReservation(@Param('id') id: string) {
    return this.reservationService.delete(id);
  }
}
