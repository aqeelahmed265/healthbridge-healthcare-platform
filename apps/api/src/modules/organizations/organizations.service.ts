import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async getOrganizationProfile(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        locations: true,
        departments: true,
      },
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async listClinicLocations(organizationId: string) {
    return this.prisma.clinicLocation.findMany({
      where: { organizationId, active: true },
      include: { departments: true },
    });
  }

  async listDepartments(organizationId: string) {
    return this.prisma.department.findMany({
      where: { organizationId, active: true },
      include: { location: true },
    });
  }
}
