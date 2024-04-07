import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumEventSort {
  ALPHABETIC = 'alphabetic',
  DATE = 'date',
  CATEGORY = 'category',
}

export enum EnumSortType {
  ASK = 'asc',
  DESC = 'desc',
}

export class getAllEventsDto {
  @IsOptional()
  @IsEnum(EnumEventSort)
  sort?: EnumEventSort;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(EnumSortType)
  type?: EnumSortType;
}
