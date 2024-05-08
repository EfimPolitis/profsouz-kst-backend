import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumUserSort {
  ALPHABETIC = 'alphabetic',
  DATE = 'date',
  CATEGORY = 'category',
}

export enum EnumSortType {
  ASK = 'asc',
  DESC = 'desc',
}

export class getAllUsersDto {
  @IsOptional()
  @IsEnum(EnumUserSort)
  sort?: EnumUserSort;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(EnumSortType)
  type?: EnumSortType;
}
