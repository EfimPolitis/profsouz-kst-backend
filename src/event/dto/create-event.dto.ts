import { Optional } from '@nestjs/common';
import { EStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  organizer: string;

  @Optional()
  @IsString()
  link?: string;

  @IsString()
  date: string;

  categoriesId: string[];

  imagesId: string[];

  @Optional()
  @IsNumber()
  places?: number;

  @IsOptional()
  @IsEnum(EStatus)
  status?: EStatus;
}
