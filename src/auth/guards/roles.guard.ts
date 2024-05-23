import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

// const accessLevel = [
//   { role: 'ADMIN', value: 3 },
//   { role: 'MODER', value: 2 },
//   { role: 'USER', value: 1 },
// ];

const accessLevel = {
  ADMIN: 3,
  MODER: 2,
  USER: 1,
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, ctx.getHandler());

    if (!roles) return true;

    const { user } = ctx.switchToHttp().getRequest();

    const requiredLevel = accessLevel[roles];
    const userLevel = accessLevel[user.role];

    return userLevel >= requiredLevel;
  }
}
