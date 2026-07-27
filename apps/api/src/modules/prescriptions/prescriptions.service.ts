import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePrescriptionDto, PrescriptionItemDto } from './dto/create-prescription.dto';
import { AllergyWarningDto } from '@healthbridge/contracts';
import { PrescriptionStatus } from '@healthbridge/shared';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async evaluateMedicationAllergies(
    patientId: string,
    medicationItems: PrescriptionItemDto[],
  ): Promise<AllergyWarningDto[]> {
    const patientAllergies = await this.prisma.allergy.findMany({
      where: { patientId },
    });

    if (patientAllergies.length === 0) return [];

    const warnings: AllergyWarningDto[] = [];

    for (const item of medicationItems) {
      const medNameLower = item.medicationName.toLowerCase();

      for (const allergy of patientAllergies) {
        const allergenLower = allergy.allergen.toLowerCase();

        if (
          medNameLower.includes(allergenLower) ||
          allergenLower.includes(medNameLower)
        ) {
          warnings.push({
            hasWarning: true,
            allergen: allergy.allergen,
            severity: allergy.severity,
            reaction: allergy.reaction || 'Potential Adverse Reaction',
            medicationName: item.medicationName,
            recommendation: `Patient has documented allergy to ${allergy.allergen}. Review medication choice.`,
          });
        }
      }
    }

    return warnings;
  }

  async issueMedicationOrder(organizationId: string, dto: CreatePrescriptionDto) {
    const warnings = await this.evaluateMedicationAllergies(dto.patientId, dto.items);

    const prescription = await this.prisma.prescription.create({
      data: {
        organizationId,
        patientId: dto.patientId,
        providerId: dto.providerId,
        encounterId: dto.encounterId,
        status: PrescriptionStatus.ACTIVE,
        notes: dto.notes,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        items: {
          create: dto.items.map((i) => ({
            medicationName: i.medicationName,
            dosage: i.dosage,
            frequency: i.frequency,
            route: i.route,
            refills: i.refills,
            instructions: i.instructions,
          })),
        },
      },
      include: {
        patient: true,
        provider: { include: { user: true } },
        items: true,
      },
    });

    return {
      prescription,
      allergyWarnings: warnings,
    };
  }

  async listPrescriptions(organizationId: string, patientId?: string, status?: PrescriptionStatus) {
    const where: any = { organizationId };
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    return this.prisma.prescription.findMany({
      where,
      include: {
        patient: true,
        provider: { include: { user: true } },
        items: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async discontinuePrescription(id: string, organizationId: string, reason?: string) {
    const prescription = await this.prisma.prescription.findFirst({
      where: { id, organizationId },
    });

    if (!prescription) throw new NotFoundException('Prescription not found');

    return this.prisma.prescription.update({
      where: { id },
      data: {
        status: PrescriptionStatus.DISCONTINUED,
        notes: reason ? `Discontinued: ${reason}` : prescription.notes,
      },
    });
  }
}
