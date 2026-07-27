import { TenantGuard } from '../src/common/guards/tenant.guard';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '@healthbridge/shared';

describe('TenantGuard', () => {
  let guard: TenantGuard;

  beforeEach(() => {
    guard = new TenantGuard();
  });

  it('should allow access when requested orgId matches user orgId', () => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { organizationId: 'org-100', roles: [UserRole.CLINIC_ADMIN] },
          params: { organizationId: 'org-100' },
        }),
      }),
    };

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should throw ForbiddenException on cross-tenant access attempt', () => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { organizationId: 'org-100', roles: [UserRole.CLINIC_ADMIN] },
          params: { organizationId: 'org-200' },
        }),
      }),
    };

    expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
  });

  it('should allow Super Admin to switch tenant contexts', () => {
    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { organizationId: 'org-100', roles: [UserRole.SUPER_ADMIN] },
          params: { organizationId: 'org-200' },
        }),
      }),
    };

    expect(guard.canActivate(mockContext)).toBe(true);
  });
});
