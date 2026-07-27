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
    where: { slug: 'metro-health' },
    update: {},
    create: {
      name: 'Metropolitan Health System',
      slug: 'metro-health',
      taxId: 'XX-XXXXXXX',
      email: 'contact@metrohealth.org',
      phone: '+1 (555) 019-2834',
      website: 'https://metrohealth.org',
    },
  });

  // Locations for Org 1
  const locMain = await prisma.clinicLocation.upsert({
    where: { id: 'loc-metro-main' },
    update: {},
    create: {
      id: 'loc-metro-main',
      organizationId: org1.id,
      name: 'Metropolitan Main Hospital & Clinics',
      code: 'LOC-MAIN',
      addressLine1: '100 Medical Center Way',
      city: 'Metropolis',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '+1 (555) 019-2800',
      email: 'main@metrohealth.org',
      timezone: 'America/New_York',
    },
  });

  const locWest = await prisma.clinicLocation.upsert({
    where: { id: 'loc-metro-west' },
    update: {},
    create: {
      id: 'loc-metro-west',
      organizationId: org1.id,
      name: 'Metropolitan Westside Specialty Care',
      code: 'LOC-WEST',
      addressLine1: '450 Westside Blvd',
      city: 'Metropolis',
      state: 'NY',
      postalCode: '10024',
      country: 'USA',
      phone: '+1 (555) 019-2850',
      email: 'westside@metrohealth.org',
      timezone: 'America/New_York',
    },
  });

  // Departments for Org 1
  const deptCardio = await prisma.department.upsert({
    where: { id: 'dept-cardio' },
    update: {},
    create: {
      id: 'dept-cardio',
      organizationId: org1.id,
      name: 'Cardiology Department',
      code: 'CARD',
      description: 'Comprehensive cardiovascular disease prevention and clinical care',
    },
  });

  const deptPeds = await prisma.department.upsert({
    where: { id: 'dept-peds' },
    update: {},
    create: {
      id: 'dept-peds',
      organizationId: org1.id,
      name: 'Pediatrics & Adolescent Care',
      code: 'PEDS',
      description: 'Pediatric care from newborn through adolescence',
    },
  });

  const deptMed = await prisma.department.upsert({
    where: { id: 'dept-med' },
    update: {},
    create: {
      id: 'dept-med',
      organizationId: org1.id,
      name: 'Internal Medicine & Primary Care',
      code: 'INTMED',
      description: 'Adult general medicine, preventive health screenings, chronic disease management',
    },
  });

  // 3. Demo Accounts for all 8 roles
  const superAdminRole = await prisma.role.findUnique({ where: { name: UserRoleType.SUPER_ADMIN } });
  const clinicAdminRole = await prisma.role.findUnique({ where: { name: UserRoleType.CLINIC_ADMIN } });
  const doctorRole = await prisma.role.findUnique({ where: { name: UserRoleType.DOCTOR } });
  const nurseRole = await prisma.role.findUnique({ where: { name: UserRoleType.NURSE } });
  const recepRole = await prisma.role.findUnique({ where: { name: UserRoleType.RECEPTIONIST } });
  const billingRole = await prisma.role.findUnique({ where: { name: UserRoleType.BILLING_OFFICER } });
  const labRole = await prisma.role.findUnique({ where: { name: UserRoleType.LAB_TECHNICIAN } });
  const patientRole = await prisma.role.findUnique({ where: { name: UserRoleType.PATIENT } });

  // Users
  const userSuperAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@healthbridge.io' },
    update: {},
    create: {
      email: 'superadmin@healthbridge.io',
      passwordHash,
      firstName: 'Platform',
      lastName: 'Administrator',
      roleId: superAdminRole!.id,
    },
  });

  const userClinicAdmin = await prisma.user.upsert({
    where: { email: 'admin@metrohealth.org' },
    update: {},
    create: {
      email: 'admin@metrohealth.org',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Connor',
      roleId: clinicAdminRole!.id,
      organizationId: org1.id,
    },
  });

  const userDoctor = await prisma.user.upsert({
    where: { email: 'doctor@metrohealth.org' },
    update: {},
    create: {
      email: 'doctor@metrohealth.org',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      roleId: doctorRole!.id,
      organizationId: org1.id,
    },
  });

  const userNurse = await prisma.user.upsert({
    where: { email: 'nurse@metrohealth.org' },
    update: {},
    create: {
      email: 'nurse@metrohealth.org',
      passwordHash,
      firstName: 'Elena',
      lastName: 'Rostova',
      roleId: nurseRole!.id,
      organizationId: org1.id,
    },
  });

  const userRecep = await prisma.user.upsert({
    where: { email: 'receptionist@metrohealth.org' },
    update: {},
    create: {
      email: 'receptionist@metrohealth.org',
      passwordHash,
      firstName: 'Marcus',
      lastName: 'Vance',
      roleId: recepRole!.id,
      organizationId: org1.id,
    },
  });

  const userBilling = await prisma.user.upsert({
    where: { email: 'billing@metrohealth.org' },
    update: {},
    create: {
      email: 'billing@metrohealth.org',
      passwordHash,
      firstName: 'Rachel',
      lastName: 'Green',
      roleId: billingRole!.id,
      organizationId: org1.id,
    },
  });

  const userLab = await prisma.user.upsert({
    where: { email: 'lab@metrohealth.org' },
    update: {},
    create: {
      email: 'lab@metrohealth.org',
      passwordHash,
      firstName: 'David',
      lastName: 'Chen',
      roleId: labRole!.id,
      organizationId: org1.id,
    },
  });

  const userPatient = await prisma.user.upsert({
    where: { email: 'patient@metrohealth.org' },
    update: {},
    create: {
      email: 'patient@metrohealth.org',
      passwordHash,
      firstName: 'John',
      lastName: 'Doe',
      roleId: patientRole!.id,
      organizationId: org1.id,
    },
  });

  // Provider Profile for Doctor
  const doctorProfile = await prisma.providerProfile.upsert({
    where: { userId: userDoctor.id },
    update: {},
    create: {
      userId: userDoctor.id,
      npi: '1234567890',
      licenseNumber: 'NY-MD-98765',
      specialty: 'Cardiovascular Disease & Internal Medicine',
      departmentId: deptCardio.id,
      consultationFee: '175.00',
    },
  });

  // Doctor Schedule (Mon-Fri 09:00 - 17:00)
  for (let day = 1; day <= 5; day++) {
    await prisma.providerSchedule.upsert({
      where: {
        providerId_dayOfWeek: {
          providerId: doctorProfile.id,
          dayOfWeek: day,
        },
      },
      update: {},
      create: {
        providerId: doctorProfile.id,
        locationId: locMain.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        slotDurationMinutes: 30,
        isAvailable: true,
      },
    });
  }

  // 4. Patient Demographics & Records
  const patient1 = await prisma.patient.upsert({
    where: { mrn: 'PAT-20260727-0001' },
    update: {},
    create: {
      mrn: 'PAT-20260727-0001',
      organizationId: org1.id,
      userId: userPatient.id,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1984-06-15'),
      gender: 'Male',
      email: 'patient@metrohealth.org',
      phone: '+1 (555) 019-3344',
      addressLine1: '742 Evergreen Terrace',
      city: 'Metropolis',
      state: 'NY',
      postalCode: '10002',
      country: 'USA',
      preferredLanguage: 'English',
      bloodType: 'O_POSITIVE',
    },
  });

  // Emergency Contact
  await prisma.emergencyContact.createMany({
    data: [
      {
        patientId: patient1.id,
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 019-3345',
        isPrimary: true,
      },
    ],
    skipDuplicates: true,
  });

  // Insurance Policy
  await prisma.insurancePolicy.createMany({
    data: [
      {
        patientId: patient1.id,
        providerName: 'BlueCross BlueShield',
        policyNumber: 'BCBS-987654321',
        groupNumber: 'GRP-10023',
        subscriberName: 'John Doe',
        relationship: 'Self',
        isPrimary: true,
      },
    ],
    skipDuplicates: true,
  });

  // Allergies for Patient 1
  await prisma.allergy.createMany({
    data: [
      {
        patientId: patient1.id,
        allergen: 'Penicillin VK',
        category: 'DRUG',
        severity: 'HIGH',
        reaction: 'Anaphylaxis and acute rash',
      },
      {
        patientId: patient1.id,
        allergen: 'Peanuts',
        category: 'FOOD',
        severity: 'MODERATE',
        reaction: 'Hives and facial swelling',
      },
    ],
    skipDuplicates: true,
  });

  // Chronic Conditions
  await prisma.medicalCondition.createMany({
    data: [
      {
        patientId: patient1.id,
        code: 'ICD10-I10',
        name: 'Essential (primary) hypertension',
        status: 'ACTIVE',
        diagnosedDate: new Date('2022-03-10'),
      },
      {
        patientId: patient1.id,
        code: 'ICD10-E78.5',
        name: 'Hyperlipidemia, unspecified',
        status: 'ACTIVE',
        diagnosedDate: new Date('2023-01-14'),
      },
    ],
    skipDuplicates: true,
  });

  // 5. Appointments
  const today = new Date();
  const appointment1 = await prisma.appointment.create({
    data: {
      organizationId: org1.id,
      locationId: locMain.id,
      patientId: patient1.id,
      providerId: doctorProfile.id,
      startTime: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      endTime: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      reasonForVisit: 'Annual Cardiovascular Risk Assessment & Hypertension Follow-up',
      status: AppointmentStatus.SCHEDULED,
    },
  });

  // 6. Encounters & Vitals
  const encounter1 = await prisma.clinicalEncounter.create({
    data: {
      organizationId: org1.id,
      patientId: patient1.id,
      providerId: doctorProfile.id,
      appointmentId: appointment1.id,
      status: EncounterStatus.COMPLETED,
      chiefComplaint: 'Routine blood pressure review and mild exertional fatigue',
      subjective: 'Patient reports taking Lisinopril daily. Denies chest pain or shortness of breath.',
      objective: 'Alert, in no acute distress. Heart rate regular rhythm, lungs clear to auscultation.',
      assessment: 'Hypertension well-controlled on current medication. Lipid panel recommended.',
      plan: 'Continue Lisinopril 10mg. Order Comprehensive Metabolic Panel and Lipid Panel.',
      signedAt: new Date(),
      signedBy: userDoctor.id,
    },
  });

  // Vital Reading
  await prisma.vitalReading.create({
    data: {
      encounterId: encounter1.id,
      systolicBp: 128,
      diastolicBp: 82,
      heartRate: 72,
      respiratoryRate: 16,
      temperatureC: 36.8,
      oxygenSaturation: 98,
      heightCm: 178,
      weightKg: 81.5,
      bmi: 25.7,
      recordedBy: userNurse.id,
    },
  });

  // 7. Care Plan
  const carePlan1 = await prisma.carePlan.create({
    data: {
      organizationId: org1.id,
      patientId: patient1.id,
      title: 'Hypertension & Cardiovascular Health Management Plan',
      description: 'Multi-disciplinary plan focusing on BP target < 130/80 and dietary sodium reduction.',
      status: CarePlanStatus.ACTIVE,
      startDate: new Date('2026-01-01'),
      targetEndDate: new Date('2026-12-31'),
    },
  });

  await prisma.carePlanGoal.create({
    data: {
      carePlanId: carePlan1.id,
      title: 'Maintain Systolic BP below 130 mmHg',
      description: 'Daily home BP logging every morning',
      targetDate: new Date('2026-06-30'),
      status: 'IN_PROGRESS',
    },
  });

  const milestone1 = await prisma.carePlanMilestone.create({
    data: {
      carePlanId: carePlan1.id,
      title: 'Complete 12-Week Low Sodium DASH Diet Program',
      dueDate: new Date('2026-04-15'),
      isCompleted: true,
      completedAt: new Date('2026-04-10'),
    },
  });

  await prisma.carePlanMilestone.create({
    data: {
      carePlanId: carePlan1.id,
      title: 'Quarterly Lipid & Kidney Function Blood Panel',
      dueDate: new Date('2026-08-01'),
      isCompleted: false,
    },
  });

  // 8. Medication Catalog & Prescription
  const medLisinopril = await prisma.medicationCatalogItem.upsert({
    where: { code: 'NDC-68180-513' },
    update: {},
    create: {
      name: 'Lisinopril',
      code: 'NDC-68180-513',
      genericName: 'Lisinopril Oral Tablet',
      strength: '10 mg',
      dosageForm: 'Tablet',
      route: 'Oral',
      manufacturer: 'Lupin Pharmaceuticals',
    },
  });

  const prescription1 = await prisma.prescription.create({
    data: {
      organizationId: org1.id,
      patientId: patient1.id,
      prescriberId: doctorProfile.id,
      encounterId: encounter1.id,
      status: PrescriptionStatus.ACTIVE,
      hasAllergyWarning: false,
      items: {
        create: [
          {
            medicationCatalogId: medLisinopril.id,
            sig: 'Take 1 tablet (10mg) by mouth once daily in the morning',
            quantity: 90,
            refillsRemaining: 3,
          },
        ],
      },
    },
  });

  // 9. Lab Test Catalog & Orders
  const labCmp = await prisma.labTest.upsert({
    where: { loincCode: '2000-8' },
    update: {},
    create: {
      name: 'Comprehensive Metabolic Panel (CMP)',
      loincCode: '2000-8',
      category: 'Chemistry',
      description: 'Evaluates kidney function, electrolyte balance, blood sugar, and liver proteins.',
      specimenType: 'Blood (Serum)',
      fastingRequired: true,
    },
  });

  const labOrder1 = await prisma.labOrder.create({
    data: {
      organizationId: org1.id,
      patientId: patient1.id,
      orderingProviderId: doctorProfile.id,
      encounterId: encounter1.id,
      status: LabOrderStatus.COMPLETED,
      priority: 'ROUTINE',
      items: {
        create: [
          {
            labTestId: labCmp.id,
          },
        ],
      },
    },
  });

  const orderItem1 = await prisma.labOrderItem.findFirst({
    where: { labOrderId: labOrder1.id },
  });

  if (orderItem1) {
    await prisma.labResult.createMany({
      data: [
        {
          labOrderItemId: orderItem1.id,
          testName: 'Serum Glucose',
          numericValue: 92,
          unit: 'mg/dL',
          referenceRange: '70 - 99 mg/dL',
          flag: LabResultFlag.NORMAL,
          performingTechId: userLab.id,
        },
        {
          labOrderItemId: orderItem1.id,
          testName: 'Serum Creatinine',
          numericValue: 0.9,
          unit: 'mg/dL',
          referenceRange: '0.7 - 1.3 mg/dL',
          flag: LabResultFlag.NORMAL,
          performingTechId: userLab.id,
        },
      ],
    });
  }

  // 10. Billing & Invoice
  const invoice1 = await prisma.invoice.create({
    data: {
      organizationId: org1.id,
      patientId: patient1.id,
      invoiceNumber: 'INV-20260727-0001',
      status: InvoiceStatus.PARTIALLY_PAID,
      issueDate: new Date(),
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      subtotal: '250.00',
      tax: '0.00',
      discount: '25.00',
      totalAmount: '225.00',
      paidAmount: '100.00',
      notes: 'Initial Consultation & Diagnostic Evaluation',
      items: {
        create: [
          {
            description: 'Comprehensive Cardiovascular Consultation (99214)',
            quantity: 1,
            unitPrice: '175.00',
            totalPrice: '175.00',
          },
          {
            description: 'In-office Electrocardiogram EKG (93000)',
            quantity: 1,
            unitPrice: '75.00',
            totalPrice: '75.00',
          },
        ],
      },
      payments: {
        create: [
          {
            amount: '100.00',
            method: PaymentMethod.CREDIT_CARD,
            transactionRef: 'TXN-99887766',
            notes: 'Patient co-payment via Terminal #2',
          },
        ],
      },
    },
  });

  // 11. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        organizationId: org1.id,
        actorId: userDoctor.id,
        actorEmail: userDoctor.email,
        action: 'ENCOUNTER_SIGNED',
        resource: `ClinicalEncounter:${encounter1.id}`,
        ipAddress: '127.0.0.1',
      },
      {
        organizationId: org1.id,
        actorId: userBilling.id,
        actorEmail: userBilling.email,
        action: 'PAYMENT_RECORDED',
        resource: `Invoice:${invoice1.id}`,
        ipAddress: '127.0.0.1',
      },
    ],
  });

  console.log('✅ Deterministic seed completed successfully for HealthBridge Platform!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
