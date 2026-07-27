import { PrismaClient } from '@prisma/client';
import { UserRoleType, AppointmentStatus, EncounterStatus, CarePlanStatus, PrescriptionStatus, LabOrderStatus, LabResultFlag, InvoiceStatus, PaymentMethod } from '@healthbridge/shared';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting deterministic seed process for HealthBridge...');

  const passwordHash = await argon2.hash('HealthBridge123!');

  // 1. Roles & Permissions Setup
  const roles = Object.values(UserRoleType);
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `${roleName} system role`,
      },
    });
  }

  // 2. Organization 1: Metropolitan Health System
  const org1 = await prisma.organization.upsert({
    where: { code: 'ORG-METRO' },
    update: {},
    create: {
      name: 'Metropolitan Health System',
      code: 'ORG-METRO',
      email: 'contact@metrohealth.org',
      phone: '+1 (555) 019-2831',
      address: '100 Medical Center Way',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
  });

  // Organization 2: Horizon Wellness Clinics
  const org2 = await prisma.organization.upsert({
    where: { code: 'ORG-HORIZON' },
    update: {},
    create: {
      name: 'Horizon Wellness Clinics',
      code: 'ORG-HORIZON',
      email: 'support@horizonwellness.com',
      phone: '+1 (555) 048-9120',
      address: '450 Wellness Blvd',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
    },
  });

  // 3. Clinic Locations
  const loc1 = await prisma.clinicLocation.upsert({
    where: { organizationId_code: { organizationId: org1.id, code: 'LOC-MAIN' } },
    update: {},
    create: {
      organizationId: org1.id,
      name: 'Metropolitan Main Campus',
      code: 'LOC-MAIN',
      phone: '+1 (555) 019-2832',
      address: '100 Medical Center Way, Building A',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      timeZone: 'America/New_York',
    },
  });

  const loc2 = await prisma.clinicLocation.upsert({
    where: { organizationId_code: { organizationId: org1.id, code: 'LOC-WEST' } },
    update: {},
    create: {
      organizationId: org1.id,
      name: 'Metropolitan West Pavilion',
      code: 'LOC-WEST',
      phone: '+1 (555) 019-2899',
      address: '250 West 57th St',
      city: 'New York',
      state: 'NY',
      zipCode: '10019',
      timeZone: 'America/New_York',
    },
  });

  // 4. Departments
  const deptCardio = await prisma.department.upsert({
    where: { organizationId_code: { organizationId: org1.id, code: 'DEP-CARD' } },
    update: {},
    create: {
      organizationId: org1.id,
      locationId: loc1.id,
      name: 'Cardiology Department',
      code: 'DEP-CARD',
    },
  });

  const deptPeds = await prisma.department.upsert({
    where: { organizationId_code: { organizationId: org1.id, code: 'DEP-PED' } },
    update: {},
    create: {
      organizationId: org1.id,
      locationId: loc1.id,
      name: 'Pediatrics Department',
      code: 'DEP-PED',
    },
  });

  // 5. Seed Users & Profiles for Org 1
  const createOrgUser = async (
    email: string,
    firstName: string,
    lastName: string,
    role: UserRoleType,
  ) => {
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        organizationId: org1.id,
        email,
        passwordHash,
        firstName,
        lastName,
        emailVerified: true,
        userRoles: {
          create: {
            roleId: roleRecord!.id,
          },
        },
      },
    });
    return user;
  };

  const superAdmin = await createOrgUser('superadmin@healthbridge.io', 'Alex', 'Vance', UserRoleType.SUPER_ADMIN);
  const clinicAdmin = await createOrgUser('admin@metrohealth.org', 'Catherine', 'Janeway', UserRoleType.CLINIC_ADMIN);
  const doctorUser = await createOrgUser('doctor@metrohealth.org', 'Sarah', 'Jenkins', UserRoleType.DOCTOR);
  const nurseUser = await createOrgUser('nurse@metrohealth.org', 'Elena', 'Rostova', UserRoleType.NURSE);
  const recepUser = await createOrgUser('receptionist@metrohealth.org', 'Marcus', 'Vance', UserRoleType.RECEPTIONIST);
  const billingUser = await createOrgUser('billing@metrohealth.org', 'Rachel', 'Green', UserRoleType.BILLING_OFFICER);
  const labTechUser = await createOrgUser('lab@metrohealth.org', 'David', 'Chen', UserRoleType.LAB_TECHNICIAN);
  const patientUser = await createOrgUser('patient@metrohealth.org', 'John', 'Doe', UserRoleType.PATIENT);

  // 6. Provider Profile (Dr. Sarah Jenkins)
  const provider = await prisma.providerProfile.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      departmentId: deptCardio.id,
      licenseNumber: 'MD-99201-NY',
      npiNumber: '1092837461',
      specialty: 'Cardiovascular Disease',
      title: 'Dr.',
      consultFee: new prisma.providerProfile.fields.consultFee.constructor(150.00),
    },
  });

  // Provider Schedule (Monday - Friday 9 AM to 5 PM)
  for (let day = 1; day <= 5; day++) {
    await prisma.providerSchedule.create({
      data: {
        providerId: provider.id,
        locationId: loc1.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        slotDurationMinutes: 30,
        bufferMinutes: 5,
      },
    });
  }

  // 7. Seed Patients
  const patient1 = await prisma.patient.upsert({
    where: { mrn: 'PAT-20260101-0001' },
    update: {},
    create: {
      organizationId: org1.id,
      userId: patientUser.id,
      mrn: 'PAT-20260101-0001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1985-06-15'),
      gender: 'Male',
      bloodType: 'A+',
      email: 'patient@metrohealth.org',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      allergies: {
        create: [
          { allergen: 'Penicillin', severity: 'SEVERE', reaction: 'Anaphylaxis' },
          { allergen: 'Peanuts', severity: 'MODERATE', reaction: 'Hives' },
        ],
      },
      conditions: {
        create: [
          { icdCode: 'I10', name: 'Essential Hypertension', status: 'ACTIVE' },
          { icdCode: 'E11.9', name: 'Type 2 Diabetes Mellitus', status: 'CHRONIC' },
        ],
      },
      insurancePolicies: {
        create: [
          {
            providerName: 'BlueCross BlueShield',
            policyNumber: 'BCBS-98210491',
            groupNumber: 'GRP-9921',
            effectiveDate: new Date('2024-01-01'),
          },
        ],
      },
    },
  });

  // 8. Appointments & Clinical Encounter
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setMinutes(30);

  const apt = await prisma.appointment.create({
    data: {
      organizationId: org1.id,
      locationId: loc1.id,
      providerId: provider.id,
      patientId: patient1.id,
      startTime: tomorrow,
      endTime: tomorrowEnd,
      type: 'Follow-up Consultation',
      status: AppointmentStatus.CONFIRMED,
      reason: 'Routine blood pressure and diabetes evaluation',
    },
  });

  const encounter = await prisma.clinicalEncounter.create({
    data: {
      organizationId: org1.id,
      appointmentId: apt.id,
      patientId: patient1.id,
      providerId: provider.id,
      status: EncounterStatus.COMPLETED,
      chiefComplaint: 'Patient presents for 3-month hypertension check.',
      symptoms: 'Mild morning fatigue, no chest pain or shortness of breath.',
      assessment: 'Hypertension well controlled on Lisinopril. HbA1c stable.',
      plan: 'Continue Lisinopril 10mg daily. Order routine BMP and Lipid Panel.',
      vitals: {
        create: {
          heightCm: 178,
          weightKg: 82,
          systolicBp: 124,
          diastolicBp: 80,
          heartRate: 72,
          tempCelsius: 36.8,
          spo2Percent: 99,
          bmi: 25.88,
        },
      },
      diagnoses: {
        create: [
          { icdCode: 'I10', description: 'Essential Hypertension', type: 'PRIMARY' },
        ],
      },
    },
  });

  // 9. Care Plan
  const carePlan = await prisma.carePlan.create({
    data: {
      organizationId: org1.id,
      patientId: patient1.id,
      providerId: provider.id,
      title: 'Hypertension Management & Lifestyle Program',
      condition: 'Essential Hypertension (ICD-10 I10)',
      status: CarePlanStatus.ACTIVE,
      startDate: new Date(),
      progress: 50,
      goals: {
        create: [
          { description: 'Maintain blood pressure below 130/80 mmHg' },
          { description: '30 minutes of moderate aerobic exercise 4x weekly' },
        ],
      },
      milestones: {
        create: [
          { title: 'Week 2 BP Log Submission', dueDate: new Date(Date.now() + 14 * 86400000), completed: true },
          { title: 'Month 1 Nutritionist Consult', dueDate: new Date(Date.now() + 30 * 86400000), completed: false },
        ],
      },
      progressEntries: {
        create: [
          { updatedBy: 'Dr. Sarah Jenkins', notes: 'Initial goals set. Patient motivated.', percentage: 50 },
        ],
      },
    },
  });

  // 10. Lab Test Catalog, Order & Result
  const labTest = await prisma.labTest.upsert({
    where: { organizationId_code: { organizationId: org1.id, code: 'LAB-BMP' } },
    update: {},
    create: {
      organizationId: org1.id,
      code: 'LAB-BMP',
      name: 'Basic Metabolic Panel (BMP)',
      category: 'Biochemistry',
      specimenType: 'Serum',
      referenceRange: '70-99 mg/dL',
      unit: 'mg/dL',
    },
  });

  const labOrder = await prisma.labOrder.create({
    data: {
      organizationId: org1.id,
      patientId: patient1.id,
      providerId: provider.id,
      encounterId: encounter.id,
      status: LabOrderStatus.COMPLETED,
      items: {
        create: [{ labTestId: labTest.id }],
      },
    },
    include: { items: true },
  });

  await prisma.labResult.create({
    data: {
      labOrderItemId: labOrder.items[0].id,
      resultValue: '92',
      unit: 'mg/dL',
      referenceRange: '70-99 mg/dL',
      flag: LabResultFlag.NORMAL,
      performedBy: 'David Chen',
      reviewedByDoctor: true,
    },
  });

  // 11. Invoice & Payment
  const invoice = await prisma.invoice.create({
    data: {
      organizationId: org1.id,
      invoiceNumber: 'INV-20260101-0001',
      patientId: patient1.id,
      status: InvoiceStatus.PAID,
      dueDate: new Date(Date.now() + 30 * 86400000),
      subtotal: new prisma.invoice.fields.subtotal.constructor(150.00),
      tax: new prisma.invoice.fields.tax.constructor(0.00),
      discount: new prisma.invoice.fields.discount.constructor(0.00),
      totalAmount: new prisma.invoice.fields.totalAmount.constructor(150.00),
      paidAmount: new prisma.invoice.fields.paidAmount.constructor(150.00),
      items: {
        create: [
          { description: 'Specialist Consultation - Dr. Sarah Jenkins', quantity: 1, unitPrice: 150.00, totalPrice: 150.00 },
        ],
      },
      payments: {
        create: [
          { amount: 150.00, method: PaymentMethod.CREDIT_CARD, transactionRef: 'TXN-992104' },
        ],
      },
    },
  });

  // 12. Audit Log
  await prisma.auditLog.create({
    data: {
      organizationId: org1.id,
      userId: doctorUser.id,
      userEmail: doctorUser.email,
      action: 'CREATE_CLINICAL_ENCOUNTER',
      resourceType: 'ClinicalEncounter',
      resourceId: encounter.id,
      changeSummary: 'Recorded visit notes and vitals for patient John Doe',
    },
  });

  console.log('✅ Deterministic seed completed successfully!');
  console.log('🔑 Demo Accounts (All passwords: HealthBridge123!):');
  console.log('   - Super Admin:       superadmin@healthbridge.io');
  console.log('   - Clinic Admin:      admin@metrohealth.org');
  console.log('   - Doctor:            doctor@metrohealth.org');
  console.log('   - Nurse:             nurse@metrohealth.org');
  console.log('   - Receptionist:      receptionist@metrohealth.org');
  console.log('   - Billing Officer:   billing@metrohealth.org');
  console.log('   - Lab Technician:    lab@metrohealth.org');
  console.log('   - Patient:           patient@metrohealth.org');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
