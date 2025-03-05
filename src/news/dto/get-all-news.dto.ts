import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumNewsSort {
  ALPHABETIC = 'alphabetic',
  VIEWS = 'views',
  CREATED_AT = 'CREATED_AT',
}

export enum EnumSortOrder {
  ASK = 'asc',
  DESC = 'desc',
}

export class getManyNewsDto {
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(EnumNewsSort)
  sort?: EnumNewsSort;

  @IsOptional()
  @IsEnum(EnumSortOrder)
  order?: EnumSortOrder;

  @IsOptional()
  @IsString()
  created_at_start?: string;

  @IsOptional()
  @IsString()
  created_at_end?: string;

  @IsOptional()
  @IsString()
  updated_at_start?: string;

  @IsOptional()
  @IsString()
  updated_at_end?: string;
}
