import { Optional } from '@nestjs/common';
import { EUserRole } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  userName: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @Optional()
  middleName: string;

  @IsEmail()
  email: string;

  @Optional()
  role: EUserRole;

  @Optional()
  @IsString()
  password: string;
}
