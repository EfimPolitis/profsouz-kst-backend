import { IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  UserName: string;

  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  @IsString()
  Password: string;
}
