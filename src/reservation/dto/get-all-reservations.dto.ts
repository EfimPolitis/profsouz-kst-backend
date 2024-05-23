import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumReservationSort {
  ALPHABETIC = 'alphabetic',
  DATE = 'date',
}

export enum EnumSortType {
  ASK = 'asc',
  DESC = 'desc',
}

export class getAllReservationDto {
  page: string;

  @IsOptional()
  @IsEnum(EnumReservationSort)
  sort?: EnumReservationSort;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(EnumSortType)
  type?: EnumSortType;
}
