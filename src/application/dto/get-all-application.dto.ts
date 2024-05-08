import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumApplicationSort {
  ALPHABETIC = 'alphabetic',
  DATE = 'date',
  CATEGORY = 'category',
}

export enum EnumSortType {
  ASK = 'asc',
  DESC = 'desc',
}

export class getAllApplicationsDto {
  @IsOptional()
  @IsEnum(EnumApplicationSort)
  sort?: EnumApplicationSort;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(EnumSortType)
  type?: EnumSortType;
}
