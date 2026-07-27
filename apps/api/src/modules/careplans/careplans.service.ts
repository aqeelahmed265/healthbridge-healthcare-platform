import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCarePlanDto } from './dto/create-careplan.dto';
import { CarePlanStatus } from '@healthbridge/shared';

@Injectable()
export class CarePlansService {
  constructor(private prisma: PrismaService) {}

  async createCarePlan(organizationId: string, dto: CreateCarePlanDto) {
    const carePlan = await this.prisma.carePlan.create({
      data: {
        organizationId,
        patientId: dto.patientId,
        providerId: dto.providerId,
        title: dto.title,
        description: dto.description,
        condition: dto.condition,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        status: CarePlanStatus.ACTIVE,
        goals: dto.goals
          ? {
              create: dto.goals.map((g) => ({
                description: g.description,
                targetDate: g.targetDate ? new Date(g.targetDate) : null,
              })),
            }
          : undefined,
        milestones: dto.milestones
          ? {
              create: dto.milestones.map((m) => ({
                title: m.title,
                dueDate: new Date(m.dueDate),
              })),
            }
          : undefined,
      },
      include: {
        patient: true,
        provider: { include: { user: true } },
        goals: true,
        milestones: true,
      },
    });

    return carePlan;
  }

  async listCarePlans(organizationId: string, patientId?: string, status?: CarePlanStatus) {
    const where: any = { organizationId };
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    return this.prisma.carePlan.findMany({
      where,
      include: {
        patient: true,
        provider: { include: { user: true } },
        goals: true,
        milestones: true,
        progressEntries: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCarePlanDetails(id: string, organizationId: string) {
    const carePlan = await this.prisma.carePlan.findFirst({
      where: { id, organizationId },
      include: {
        patient: true,
        provider: { include: { user: true } },
        goals: true,
        milestones: true,
        progressEntries: { orderBy: { createdAt: 'desc' } },
        tasks: true,
      },
    });

    if (!carePlan) throw new NotFoundException('Care plan not found');
    return carePlan;
  }

  async markMilestoneCompleted(milestoneId: string, organizationId: string) {
    const milestone = await this.prisma.carePlanMilestone.findUnique({
      where: { id: milestoneId },
      include: { carePlan: true },
    });

    if (!milestone || milestone.carePlan.organizationId !== organizationId) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.carePlan.status === CarePlanStatus.ARCHIVED) {
      throw new BadRequestException('Cannot modify milestones on an archived care plan');
    }

    await this.prisma.carePlanMilestone.update({
      where: { id: milestoneId },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    // Recalculate progress percentage
    return this.recalculateCarePlanProgress(milestone.carePlanId);
  }

  async recordProgressEntry(
    carePlanId: string,
    organizationId: string,
    updatedByName: string,
    notes: string,
  ) {
    const carePlan = await this.getCarePlanDetails(carePlanId, organizationId);

    if (carePlan.status === CarePlanStatus.ARCHIVED) {
      throw new BadRequestException('Archived plans cannot receive new progress updates');
    }

    return this.prisma.carePlanProgressEntry.create({
      data: {
        carePlanId,
        updatedBy: updatedByName,
        notes,
        percentage: carePlan.progress,
      },
    });
  }

  async evaluateOverdueMilestones(organizationId: string) {
    const now = new Date();
    const overdue = await this.prisma.carePlanMilestone.findMany({
      where: {
        carePlan: { organizationId, status: CarePlanStatus.ACTIVE },
        completed: false,
        dueDate: { lt: now },
      },
      include: { carePlan: { include: { patient: true } } },
    });

    return overdue;
  }

  private async recalculateCarePlanProgress(carePlanId: string) {
    const milestones = await this.prisma.carePlanMilestone.findMany({
      where: { carePlanId },
    });

    if (milestones.length === 0) return;

    const completedCount = milestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / milestones.length) * 100);

    return this.prisma.carePlan.update({
      where: { id: carePlanId },
      data: {
        progress,
        status: progress === 100 ? CarePlanStatus.COMPLETED : CarePlanStatus.ACTIVE,
      },
      include: { goals: true, milestones: true },
    });
  }
}
