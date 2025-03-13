import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumApplicationSort {
  PLACES_ASK = '1',
  PLACES_DESC = '2',
  CREATED_AT_ASC = '3',
  CREATED_AT_DESC = '4',
}

export class getAllApplicationsDto {
  page: string;

  @IsOptional()
  @IsEnum(EnumApplicationSort)
  sort?: EnumApplicationSort;

  @IsOptional()
  @IsDateString()
  created_at_start?: string;

  @IsDateString()
  @IsOptional()
  created_at_end?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
