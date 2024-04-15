import { IsNumber, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;

  @IsNumber()
  ticketsCount: number;
}
