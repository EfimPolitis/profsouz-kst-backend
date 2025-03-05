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
  ACCESS_TOKEN_NAME = 'accessToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.userId);

    return {
      user,
      ...tokens,
    };
  }

  async register(dto: CreateUserDto) {
    const oldUser = await this.userService.getByUserName(dto.userName);

    if (oldUser) throw new BadRequestException('User alredy exists');

    const { password, ...user } = await this.userService.create(dto);

    const tokens = await this.issueTokens(user.userId);

    return {
      user,
      ...tokens,
    };
  }

  async getByToken(token: string) {
    const result = await this.jwt.verifyAsync(token);

    if (!result) throw new UnauthorizedException('Invalid token');

    const { password, ...user } = await this.userService.getById(result.userId);

    return user;
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const { password, ...user } = await this.userService.getById(result.userId);

    const tokens = await this.issueTokens(user.userId);
    return {
      user,
      ...tokens,
    };
  }

  private async issueTokens(userId: number) {
    const data = { userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByUserName(dto.userName);

    if (!user) throw new NotFoundException('Invalid password or user!');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new NotFoundException('Invalid password or user!');

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
