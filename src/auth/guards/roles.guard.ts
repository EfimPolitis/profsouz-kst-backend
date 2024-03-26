import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, ctx.getHandler());
    if (!roles) return true;

    const { user } = ctx.switchToHttp().getRequest();

    return roles === user.role ? true : false;
  }
}
