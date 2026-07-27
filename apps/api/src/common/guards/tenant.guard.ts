import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: UserPayload = request.user;

    if (!user) {
      throw new ForbiddenException('Authentication required for tenant isolation check');
    }

    // Super admins can switch contexts or access all organizations
    if (user.roles?.includes(UserRole.SUPER_ADMIN)) {
      return true;
    }

    const requestOrgId =
      request.params?.organizationId ||
      request.query?.organizationId ||
      request.body?.organizationId ||
      request.headers['x-organization-id'];

    if (requestOrgId && requestOrgId !== user.organizationId) {
      throw new ForbiddenException(
        `Cross-tenant access prohibited. User org: ${user.organizationId}, Requested org: ${requestOrgId}`,
      );
    }

    return true;
  }
}
