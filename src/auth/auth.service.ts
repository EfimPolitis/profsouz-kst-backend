import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto) {
    const { Password, ...user } = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.UserID);

    return {
      user,
      ...tokens,
    };
  }

  async register(dto: CreateUserDto) {
    console.log(dto);
    const oldUser = await this.userService.getByUserName(dto.UserName);

    if (oldUser) throw new BadRequestException('User alredy exists');

    const { Password, ...user } = await this.userService.create(dto);

    const tokens = await this.issueTokens(user.UserID);

    return {
      user,
      ...tokens,
    };
  }

  async getByToken(token: string) {
    const result = await this.jwt.verifyAsync(token);

    if (!result) throw new UnauthorizedException('Invalid token');

    const { Password, ...user } = await this.userService.getById(result.id);

    return user;
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    console.log(result.id, 2);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const { Password, ...user } = await this.userService.getById(result.id);
    const tokens = await this.issueTokens(user.UserID);
    return {
      user,
      ...tokens,
    };
  }

  private async issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByUserName(dto.UserName);

    if (!user) throw new NotFoundException('Not found user!');

    const isValid = await verify(user.Password, dto.Password);

    if (!isValid) throw new UnauthorizedException('Invalid password!');

    return user;
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
