import { IsOptional, IsString } from 'class-validator';

export class getAllCategoriesDto {
  @IsOptional()
  @IsString()
  search?: string;
}
