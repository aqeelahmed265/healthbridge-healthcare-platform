import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { formatMedicalRecordNumber } from '@healthbridge/shared';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async registerClinicPatient(organizationId: string, dto: CreatePatientDto) {
    const existing = await this.prisma.patient.findFirst({
      where: { organizationId, email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('A patient with this email already exists in the organization.');
    }

    const patientCount = await this.prisma.patient.count({
      where: { organizationId },
    });

    const mrn = formatMedicalRecordNumber(new Date(), patientCount + 1);

    return this.prisma.patient.create({
      data: {
        organizationId,
        mrn,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        zipCode: dto.zipCode,
        bloodType: dto.bloodType,
      },
    });
  }

  async listPatients(organizationId: string, search?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = { organizationId, active: true };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { mrn: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPatientProfile(patientId: string, organizationId: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id: patientId, organizationId },
      include: {
        contacts: true,
        emergencyContacts: true,
        insurancePolicies: true,
        allergies: true,
        conditions: true,
      },
    });

    if (!patient) throw new NotFoundException('Patient record not found');
    return patient;
  }

  async assemblePatientTimeline(patientId: string, organizationId: string) {
    const patient = await this.getPatientProfile(patientId, organizationId);

    const [appointments, encounters, prescriptions, labOrders, documents, invoices] =
      await Promise.all([
        this.prisma.appointment.findMany({
          where: { patientId, organizationId },
          include: { provider: { include: { user: true } }, location: true },
          orderBy: { startTime: 'desc' },
        }),
        this.prisma.clinicalEncounter.findMany({
          where: { patientId, organizationId },
          include: {
            provider: { include: { user: true } },
            vitals: true,
            diagnoses: true,
          },
          orderBy: { encounterDate: 'desc' },
        }),
        this.prisma.prescription.findMany({
          where: { patientId, organizationId },
          include: { items: true, provider: { include: { user: true } } },
          orderBy: { startDate: 'desc' },
        }),
        this.prisma.labOrder.findMany({
          where: { patientId, organizationId },
          include: {
            items: { include: { labTest: true, result: true } },
            provider: { include: { user: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.medicalDocument.findMany({
          where: { patientId, organizationId },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.invoice.findMany({
          where: { patientId, organizationId },
          include: { items: true, payments: true },
          orderBy: { issueDate: 'desc' },
        }),
      ]);

    const timelineEvents: Array<{
      id: string;
      category: 'APPOINTMENT' | 'ENCOUNTER' | 'PRESCRIPTION' | 'LAB_ORDER' | 'DOCUMENT' | 'INVOICE';
      timestamp: Date;
      title: string;
      description: string;
      status?: string;
      details: any;
    }> = [];

    appointments.forEach((apt) => {
      timelineEvents.push({
        id: apt.id,
        category: 'APPOINTMENT',
        timestamp: apt.startTime,
        title: `Appointment: ${apt.type}`,
        description: `With Dr. ${apt.provider.user.lastName} at ${apt.location.name}`,
        status: apt.status,
        details: apt,
      });
    });

    encounters.forEach((enc) => {
      timelineEvents.push({
        id: enc.id,
        category: 'ENCOUNTER',
        timestamp: enc.encounterDate,
        title: `Clinical Visit Note`,
        description: `Chief Complaint: ${enc.chiefComplaint}`,
        status: enc.status,
        details: enc,
      });
    });

    prescriptions.forEach((rx) => {
      timelineEvents.push({
        id: rx.id,
        category: 'PRESCRIPTION',
        timestamp: rx.startDate,
        title: `Prescription Issued`,
        description: `${rx.items.map((i) => `${i.medicationName} (${i.dosage})`).join(', ')}`,
        status: rx.status,
        details: rx,
      });
    });

    labOrders.forEach((lab) => {
      timelineEvents.push({
        id: lab.id,
        category: 'LAB_ORDER',
        timestamp: lab.createdAt,
        title: `Lab Order (${lab.items.length} tests)`,
        description: `${lab.items.map((i) => i.labTest.name).join(', ')}`,
        status: lab.status,
        details: lab,
      });
    });

    documents.forEach((doc) => {
      timelineEvents.push({
        id: doc.id,
        category: 'DOCUMENT',
        timestamp: doc.createdAt,
        title: `Document Uploaded: ${doc.fileName}`,
        description: `Category: ${doc.category}`,
        details: doc,
      });
    });

    invoices.forEach((inv) => {
      timelineEvents.push({
        id: inv.id,
        category: 'INVOICE',
        timestamp: inv.issueDate,
        title: `Invoice ${inv.invoiceNumber}`,
        description: `Total: $${inv.totalAmount.toFixed(2)} | Paid: $${inv.paidAmount.toFixed(2)}`,
        status: inv.status,
        details: inv,
      });
    });

    timelineEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      patient,
      timeline: timelineEvents,
    };
  }
}
