import { Optional } from '@nestjs/common';
import { EUserRole } from '@prisma/client';
import { IsEmail } from 'class-validator';
import { AuthDto } from 'src/auth/dto/auth.dto';

export class CreateUserDto extends AuthDto {
  firstName: string;
  lastName: string;

  @Optional()
  middleName: string;

  @IsEmail()
  email: string;

  @Optional()
  role: EUserRole;
}
