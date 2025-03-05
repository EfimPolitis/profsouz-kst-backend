import { IsString } from 'class-validator';

export class CreateNewsDto {
  imagesId: string[];

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;
}
