import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { EncounterStatus } from '@healthbridge/shared';

@Injectable()
export class EncountersService {
  constructor(private prisma: PrismaService) {}

  async createEncounter(organizationId: string, dto: CreateEncounterDto) {
    let bmi: number | undefined;
    if (dto.vitals?.heightCm && dto.vitals?.weightKg) {
      const heightM = dto.vitals.heightCm / 100;
      bmi = parseFloat((dto.vitals.weightKg / (heightM * heightM)).toFixed(2));
    }

    return this.prisma.clinicalEncounter.create({
      data: {
        organizationId,
        patientId: dto.patientId,
        providerId: dto.providerId,
        appointmentId: dto.appointmentId,
        chiefComplaint: dto.chiefComplaint,
        symptoms: dto.symptoms,
        assessment: dto.assessment,
        plan: dto.plan,
        status: EncounterStatus.DRAFT,
        vitals: dto.vitals
          ? {
              create: {
                heightCm: dto.vitals.heightCm,
                weightKg: dto.vitals.weightKg,
                systolicBp: dto.vitals.systolicBp,
                diastolicBp: dto.vitals.diastolicBp,
                heartRate: dto.vitals.heartRate,
                tempCelsius: dto.vitals.tempCelsius,
                spo2Percent: dto.vitals.spo2Percent,
                bmi,
              },
            }
          : undefined,
        diagnoses: dto.diagnoses
          ? {
              create: dto.diagnoses.map((d) => ({
                icdCode: d.icdCode,
                description: d.description,
                type: d.type || 'PRIMARY',
              })),
            }
          : undefined,
      },
      include: {
        patient: true,
        provider: { include: { user: true } },
        vitals: true,
        diagnoses: true,
      },
    });
  }

  async listEncounters(organizationId: string, patientId?: string, providerId?: string) {
    const where: any = { organizationId };
    if (patientId) where.patientId = patientId;
    if (providerId) where.providerId = providerId;

    return this.prisma.clinicalEncounter.findMany({
      where,
      include: {
        patient: true,
        provider: { include: { user: true } },
        vitals: true,
        diagnoses: true,
      },
      orderBy: { encounterDate: 'desc' },
    });
  }

  async getEncounterDetails(id: string, organizationId: string) {
    const encounter = await this.prisma.clinicalEncounter.findFirst({
      where: { id, organizationId },
      include: {
        patient: true,
        provider: { include: { user: true } },
        vitals: true,
        diagnoses: true,
        prescriptions: { include: { items: true } },
        labOrders: { include: { items: { include: { labTest: true, result: true } } } },
      },
    });

    if (!encounter) throw new NotFoundException('Clinical encounter not found');
    return encounter;
  }

  async signEncounter(id: string, organizationId: string) {
    const encounter = await this.getEncounterDetails(id, organizationId);
    return this.prisma.clinicalEncounter.update({
      where: { id: encounter.id },
      data: {
        status: EncounterStatus.SIGNED,
        signedAt: new Date(),
      },
    });
  }
}
