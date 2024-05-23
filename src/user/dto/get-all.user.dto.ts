import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumUserSort {
  ALPHABETIC = 'alphabetic',
  DATE = 'date',
}

export enum EnumSortType {
  ASK = 'asc',
  DESC = 'desc',
}

export class getAllUsersDto {
  page: string;

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
