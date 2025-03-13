import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumNewsSort {
  ALPHABETIC_ASC = '1',
  ALPHABETIC_DESC = '2',
  VIEWS_ASC = '3',
  VIEWS_DESC = '4',
  CREATED_AT_ASC = '5',
  CREATED_AT_DESC = '6',
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
  @IsString()
  created_at_start?: string;

  @IsOptional()
  @IsString()
  created_at_end?: string;
}
