import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../database/prisma.service';
import { UserPayload } from '@healthbridge/contracts';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Only audit mutating operations (POST, PUT, PATCH, DELETE) or specific GET operations
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const user: UserPayload = request.user;
    const path = request.url;
    const ip = request.ip || request.connection?.remoteAddress;
    const userAgent = request.headers['user-agent'];

    return next.handle().pipe(
      tap(async (responseBody) => {
        try {
          if (user && user.organizationId) {
            const resourceId =
              responseBody?.data?.id || request.params?.id || 'GLOBAL_RESOURCE';
            const actionName = `${method}_${path.split('?')[0].replace(/\//g, '_').toUpperCase()}`;

            await this.prisma.auditLog.create({
              data: {
                organizationId: user.organizationId,
                userId: user.id,
                userEmail: user.email,
                action: actionName,
                resourceType: path.split('/')[3] || 'UNKNOWN',
                resourceId: String(resourceId),
                ipAddress: String(ip),
                userAgent: String(userAgent),
                changeSummary: `Executed ${method} on ${path}`,
              },
            });
          }
        } catch (err: any) {
          this.logger.error(`Failed to record audit log: ${err.message}`);
        }
      }),
    );
  }
}
