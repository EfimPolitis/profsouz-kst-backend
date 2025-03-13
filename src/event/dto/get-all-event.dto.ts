import { EStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumEventSort {
  ALPHABETIC_ASC = '1',
  ALPHABETIC_DESC = '2',
  PLACES_ASC = '3',
  PLACES_DESC = '4',
  DATE_ASC = '5',
  DATE_DESC = '6',
}

export class getAllEventsDto {
  @IsString()
  page: string;

  @IsOptional()
  @IsEnum(EnumEventSort)
  sort?: EnumEventSort;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  date_start?: string;

  @IsOptional()
  @IsString()
  date_end?: string;

  @IsOptional()
  @IsString()
  time_start?: string;

  @IsOptional()
  @IsString()
  time_end?: string;

  @IsOptional()
  @IsEnum(EStatus)
  status?: EStatus;
}
