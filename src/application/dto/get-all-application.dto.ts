import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumApplicationSort {
  ALPHABETIC = 'alphabetic',
  STATUS = 'status',
  TICKETS_COUNT = 'tickets_count',
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}

export enum EnumSortOrder {
  ASK = 'asc',
  DESC = 'desc',
}

export class getAllApplicationsDto {
  page: string;

  @IsOptional()
  @IsEnum(EnumApplicationSort)
  sort?: EnumApplicationSort;

  @IsOptional()
  @IsEnum(EnumSortOrder)
  order?: EnumSortOrder;

  @IsOptional()
  @IsDateString()
  created_at_start?: string;

  @IsDateString()
  @IsOptional()
  created_at_end?: string;

  @IsDateString()
  @IsOptional()
  updated_at_start?: string;

  @IsDateString()
  @IsOptional()
  updated_at_end?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
