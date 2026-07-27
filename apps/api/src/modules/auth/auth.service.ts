import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokenResponse, UserPayload } from '@healthbridge/contracts';
import { ROLE_PERMISSIONS, UserRole, Permission } from '@healthbridge/shared';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthTokenResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        userRoles: { include: { role: true } },
        patient: { select: { id: true } },
        providerProfile: { select: { id: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.active) {
      throw new ForbiddenException('Account is inactive. Please contact your administrator.');
    }

    // Lockout check
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new ForbiddenException(
        `Account locked due to multiple failed login attempts. Try again after ${user.lockedUntil.toISOString()}`,
      );
    }

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);

    if (!passwordValid) {
      const newAttempts = user.failedAttempts + 1;
      let lockedUntil: Date | null = null;

      if (newAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: newAttempts,
          lockedUntil,
        },
      });

      throw new UnauthorizedException('Invalid email or password');
    }

    // Reset failed attempts upon successful login
    if (user.failedAttempts > 0 || user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0, lockedUntil: null },
      });
    }

    const roles = user.userRoles.map((ur) => ur.role.name as UserRole);
    const userPermissions = new Set<Permission>();
    for (const r of roles) {
      const perms = ROLE_PERMISSIONS[r] || [];
      for (const p of perms) {
        userPermissions.add(p);
      }
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: user.organizationId,
      roles,
      permissions: Array.from(userPermissions),
      patientId: user.patient?.id,
      providerId: user.providerProfile?.id,
    };

    return this.generateAuthTokens(payload, ipAddress, userAgent);
  }

  async refreshToken(dto: RefreshTokenDto, ipAddress?: string, userAgent?: string): Promise<AuthTokenResponse> {
    const tokenHash = crypto.createHash('sha256').update(dto.refreshToken).digest('hex');

    const session = await this.prisma.refreshSession.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            userRoles: { include: { role: true } },
            patient: { select: { id: true } },
            providerProfile: { select: { id: true } },
          },
        },
      },
    });

    if (!session || session.revoked || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token is invalid, revoked, or expired');
    }

    // Revoke old session (Refresh Token Rotation)
    await this.prisma.refreshSession.update({
      where: { id: session.id },
      data: { revoked: true },
    });

    const user = session.user;
    const roles = user.userRoles.map((ur) => ur.role.name as UserRole);
    const userPermissions = new Set<Permission>();
    for (const r of roles) {
      const perms = ROLE_PERMISSIONS[r] || [];
      for (const p of perms) {
        userPermissions.add(p);
      }
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: user.organizationId,
      roles,
      permissions: Array.from(userPermissions),
      patientId: user.patient?.id,
      providerId: user.providerProfile?.id,
    };

    return this.generateAuthTokens(payload, ipAddress, userAgent);
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.refreshSession.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.prisma.refreshSession.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }

  private async generateAuthTokens(
    user: UserPayload,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuthTokenResponse> {
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        organizationId: user.organizationId,
        roles: user.roles,
      },
      {
        secret:
          this.configService.get<string>('JWT_ACCESS_SECRET') ||
          'healthbridge-dev-access-secret-32bytes-min!!',
        expiresIn: '15m',
      },
    );

    const refreshTokenRaw = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(refreshTokenRaw)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshSession.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        ipAddress,
        deviceInfo: userAgent,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
      expiresIn: 900, // 15 mins in seconds
      user,
    };
  }
}
