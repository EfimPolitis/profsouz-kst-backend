import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export const Auth = (role?: string) => {
  return applyDecorators(
    SetMetadata('role', role),
    Roles(role),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
};
