import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '@healthbridge/contracts';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req?.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_ACCESS_SECRET') ||
        'healthbridge-dev-access-secret-32bytes-min!!',
    });
  }

  async validate(payload: any): Promise<UserPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        patient: { select: { id: true } },
        providerProfile: { select: { id: true } },
      },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('User is inactive or no longer exists');
    }

    const roles = user.userRoles.map((ur) => ur.role.name as any);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: user.organizationId,
      roles,
      permissions: [],
      patientId: user.patient?.id,
      providerId: user.providerProfile?.id,
    };
  }
}
