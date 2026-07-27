import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AvailabilityEngine } from './availability.engine';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from '@healthbridge/shared';

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private availabilityEngine: AvailabilityEngine,
  ) {}

  async scheduleClinicalVisit(organizationId: string, dto: CreateAppointmentDto) {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException('Appointment start time must be before end time');
    }

    // Perform transactional conflict check & creation
    return this.prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          providerId: dto.providerId,
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
          startTime: { lt: endTime },
          endTime: { gt: startTime },
        },
      });

      if (conflict) {
        throw new ConflictException(
          'The selected provider is unavailable during the requested time slot.',
        );
      }

      const appointment = await tx.appointment.create({
        data: {
          organizationId,
          locationId: dto.locationId,
          providerId: dto.providerId,
          patientId: dto.patientId,
          startTime,
          endTime,
          type: dto.type,
          reason: dto.reason,
          status: AppointmentStatus.SCHEDULED,
        },
        include: {
          patient: true,
          provider: { include: { user: true } },
          location: true,
        },
      });

      await tx.appointmentStatusEvent.create({
        data: {
          appointmentId: appointment.id,
          fromStatus: AppointmentStatus.SCHEDULED,
          toStatus: AppointmentStatus.SCHEDULED,
          note: 'Appointment scheduled',
        },
      });

      return appointment;
    });
  }

  async getAvailableSlots(providerId: string, locationId: string, dateStr: string) {
    const targetDate = new Date(dateStr);
    return this.availabilityEngine.reconcileProviderAvailability(providerId, locationId, targetDate);
  }

  async listAppointments(
    organizationId: string,
    providerId?: string,
    patientId?: string,
    status?: AppointmentStatus,
    startDate?: string,
    endDate?: string,
  ) {
    const where: any = { organizationId };

    if (providerId) where.providerId = providerId;
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        provider: { include: { user: true } },
        location: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async updateAppointmentStatus(
    id: string,
    organizationId: string,
    dto: UpdateAppointmentStatusDto,
    changedByUserId?: string,
  ) {
    const apt = await this.prisma.appointment.findFirst({
      where: { id, organizationId },
    });

    if (!apt) throw new NotFoundException('Appointment not found');

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: dto.status,
        cancellationReason: dto.cancellationReason || apt.cancellationReason,
      },
    });

    await this.prisma.appointmentStatusEvent.create({
      data: {
        appointmentId: id,
        fromStatus: apt.status,
        toStatus: dto.status,
        note: dto.cancellationReason || `Status updated to ${dto.status}`,
        changedByUserId,
      },
    });

    return updated;
  }
}
