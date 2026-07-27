import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission, UserRole, ROLE_PERMISSIONS } from '@healthbridge/shared';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserPayload } from '@healthbridge/contracts';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Super Admins bypass permission checks
    if (user.roles?.includes(UserRole.SUPER_ADMIN)) {
      return true;
    }

    // Resolve permissions from user's roles
    const userPermissions = new Set<Permission>(user.permissions || []);
    if (user.roles) {
      for (const role of user.roles) {
        const perms = ROLE_PERMISSIONS[role] || [];
        for (const p of perms) {
          userPermissions.add(p);
        }
      }
    }

    const hasAllPermissions = requiredPermissions.every((perm) => userPermissions.has(perm));

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`,
      );
    }

    return true;
  }
}
