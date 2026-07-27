import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async listStaffMembers(organizationId: string) {
    return this.prisma.user.findMany({
      where: { organizationId, active: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        userRoles: { include: { role: true } },
        providerProfile: true,
      },
    });
  }

  async listProviders(organizationId: string) {
    return this.prisma.providerProfile.findMany({
      where: { user: { organizationId }, active: true },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        department: true,
        schedules: { include: { location: true } },
      },
    });
  }

  async getProviderProfile(providerId: string, organizationId: string) {
    const provider = await this.prisma.providerProfile.findFirst({
      where: { id: providerId, user: { organizationId } },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        department: true,
        schedules: { include: { location: true } },
        timeOff: true,
      },
    });

    if (!provider) throw new NotFoundException('Provider not found');
    return provider;
  }
}
