import { IsNumber, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  userId: number;

  @IsString()
  eventId: string;

  @IsNumber()
  places: number;
}
