import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateLabOrderDto, RecordLabResultDto } from './dto/create-lab-order.dto';
import { LabOrderStatus } from '@healthbridge/shared';

@Injectable()
export class LabsService {
  constructor(private prisma: PrismaService) {}

  async listLabCatalog(organizationId: string) {
    return this.prisma.labTest.findMany({
      where: { organizationId, active: true },
    });
  }

  async createLabOrder(organizationId: string, dto: CreateLabOrderDto) {
    return this.prisma.labOrder.create({
      data: {
        organizationId,
        patientId: dto.patientId,
        providerId: dto.providerId,
        encounterId: dto.encounterId,
        clinicalNotes: dto.clinicalNotes,
        status: LabOrderStatus.ORDERED,
        items: {
          create: dto.labTestIds.map((testId) => ({
            labTestId: testId,
          })),
        },
      },
      include: {
        patient: true,
        provider: { include: { user: true } },
        items: { include: { labTest: true } },
      },
    });
  }

  async listLabOrders(organizationId: string, patientId?: string, status?: LabOrderStatus) {
    const where: any = { organizationId };
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    return this.prisma.labOrder.findMany({
      where,
      include: {
        patient: true,
        provider: { include: { user: true } },
        items: { include: { labTest: true, result: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async recordLabResult(organizationId: string, dto: RecordLabResultDto) {
    const orderItem = await this.prisma.labOrderItem.findUnique({
      where: { id: dto.labOrderItemId },
      include: { labOrder: true },
    });

    if (!orderItem || orderItem.labOrder.organizationId !== organizationId) {
      throw new NotFoundException('Lab order item not found');
    }

    const result = await this.prisma.labResult.upsert({
      where: { labOrderItemId: dto.labOrderItemId },
      create: {
        labOrderItemId: dto.labOrderItemId,
        resultValue: dto.resultValue,
        unit: dto.unit,
        referenceRange: dto.referenceRange,
        flag: dto.flag,
        performedBy: dto.performedBy,
        notes: dto.notes,
      },
      update: {
        resultValue: dto.resultValue,
        unit: dto.unit,
        referenceRange: dto.referenceRange,
        flag: dto.flag,
        performedBy: dto.performedBy,
        notes: dto.notes,
        resultDate: new Date(),
      },
    });

    // Check if all items in order have results, if so mark order COMPLETED
    const orderItems = await this.prisma.labOrderItem.findMany({
      where: { labOrderId: orderItem.labOrderId },
      include: { result: true },
    });

    const allCompleted = orderItems.every((item) => item.result !== null);
    if (allCompleted) {
      await this.prisma.labOrder.update({
        where: { id: orderItem.labOrderId },
        data: { status: LabOrderStatus.COMPLETED },
      });
    }

    return result;
  }
}
