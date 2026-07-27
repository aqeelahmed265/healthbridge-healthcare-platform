import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { TimeSlotDto } from '@healthbridge/contracts';

@Injectable()
export class AvailabilityEngine {
  constructor(private prisma: PrismaService) {}

  async reconcileProviderAvailability(
    providerId: string,
    locationId: string,
    targetDate: Date,
  ): Promise<TimeSlotDto[]> {
    const dayOfWeek = targetDate.getDay();

    // 1. Fetch provider schedules for this day & location
    const schedule = await this.prisma.providerSchedule.findFirst({
      where: {
        providerId,
        locationId,
        dayOfWeek,
        active: true,
      },
    });

    if (!schedule) {
      return [];
    }

    // 2. Check if provider has approved time off on targetDate
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const timeOff = await this.prisma.providerTimeOff.findFirst({
      where: {
        providerId,
        approved: true,
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay },
      },
    });

    if (timeOff) {
      return [];
    }

    // 3. Fetch existing non-cancelled appointments for this provider on targetDate
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        providerId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        startTime: { lte: endOfDay },
        endTime: { gte: startOfDay },
      },
    });

    // 4. Generate discrete time slots
    const slots: TimeSlotDto[] = [];
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

    const slotStart = new Date(targetDate);
    slotStart.setHours(startHour, startMinute, 0, 0);

    const scheduleEnd = new Date(targetDate);
    scheduleEnd.setHours(endHour, endMinute, 0, 0);

    const durationMs = schedule.slotDurationMinutes * 60 * 1000;
    const bufferMs = schedule.bufferMinutes * 60 * 1000;

    let currentStart = new Date(slotStart);

    while (currentStart.getTime() + durationMs <= scheduleEnd.getTime()) {
      const currentEnd = new Date(currentStart.getTime() + durationMs);

      // Check collision with existing appointments
      const isOverlapping = existingAppointments.some((apt) => {
        return currentStart < apt.endTime && currentEnd > apt.startTime;
      });

      slots.push({
        startTime: currentStart.toISOString(),
        endTime: currentEnd.toISOString(),
        available: !isOverlapping,
        providerId,
        locationId,
      });

      currentStart = new Date(currentEnd.getTime() + bufferMs);
    }

    return slots;
  }

  async detectAppointmentConflict(
    providerId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    const conflicting = await this.prisma.appointment.findFirst({
      where: {
        providerId,
        id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });

    return !!conflicting;
  }
}
