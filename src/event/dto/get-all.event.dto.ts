import { IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';

export enum EnumEventSort {
  ALPHABETIC = 'alphabetic',
  TICKETS = 'tickets',
  DATE = 'date',
}

export enum EnumSortOrder {
  ASK = 'asc',
  DESC = 'desc',
}

export enum EnumEventType {
  LINK = 'link',
  TICKET = 'ticket',
}

export class getAllEventsDto {
  @IsString()
  page: string;

  @IsOptional()
  @IsEnum(EnumEventSort)
  sort?: EnumEventSort;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(EnumSortOrder)
  order?: EnumSortOrder;

  @IsOptional()
  @IsDateString()
  date_start: string;

  @IsOptional()
  @IsDateString()
  date_end: string;

  @IsOptional()
  @IsEnum(EnumEventType)
  type: EnumEventType;
}
