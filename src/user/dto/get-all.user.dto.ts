import { EUserRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum EnumUserSort {
  ALPHABETIC_ASC = '1',
  ALPHABETIC_DESC = '2',
  CREATED_AT_ASC = '3',
  CREATED_AT_DESC = '4',
  UPDATED_AT_ASC = '5',
  UPDATED_AT_DESC = '6',
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

  @IsOptional()
  @IsEnum(EUserRole)
  role?: EUserRole;
}
