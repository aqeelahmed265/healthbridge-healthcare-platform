import { PrescriptionsService } from '../src/modules/prescriptions/prescriptions.service';

describe('PrescriptionsService - Allergy Warnings', () => {
  let service: PrescriptionsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      allergy: {
        findMany: jest.fn(),
      },
    };
    service = new PrescriptionsService(mockPrisma);
  });

  it('should detect penicillin allergy when prescribing Amoxicillin', async () => {
    mockPrisma.allergy.findMany.mockResolvedValue([
      { allergen: 'Penicillin', severity: 'SEVERE', reaction: 'Anaphylaxis' },
    ]);

    const items = [
      {
        medicationName: 'Amoxicillin Penicillin',
        dosage: '500mg',
        frequency: '3x daily',
        route: 'Oral',
        refills: 0,
        instructions: 'Take with food',
      },
    ];

    const warnings = await service.evaluateMedicationAllergies('patient-1', items);
    expect(warnings.length).toBe(1);
    expect(warnings[0].hasWarning).toBe(true);
    expect(warnings[0].allergen).toBe('Penicillin');
  });

  it('should return empty warnings array if patient has no matching allergies', async () => {
    mockPrisma.allergy.findMany.mockResolvedValue([
      { allergen: 'Peanuts', severity: 'MODERATE', reaction: 'Hives' },
    ]);

    const items = [
      {
        medicationName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        route: 'Oral',
        refills: 2,
        instructions: 'Take in the morning',
      },
    ];

    const warnings = await service.evaluateMedicationAllergies('patient-1', items);
    expect(warnings.length).toBe(0);
  });
});
