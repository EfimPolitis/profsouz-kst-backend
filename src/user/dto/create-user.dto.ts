import { Optional } from '@nestjs/common';
import { EUserRole } from '@prisma/client';
import { IsEmail } from 'class-validator';
import { AuthDto } from 'src/auth/dto/auth.dto';

export class CreateUserDto extends AuthDto {
  @IsEmail()
  Email: string;

  @Optional()
  UserRole: EUserRole;
}
