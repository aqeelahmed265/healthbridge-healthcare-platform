import { AvailabilityEngine } from '../src/modules/appointments/availability.engine';

describe('AvailabilityEngine', () => {
  let engine: AvailabilityEngine;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      providerSchedule: {
        findFirst: jest.fn(),
      },
      providerTimeOff: {
        findFirst: jest.fn(),
      },
      appointment: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
    };
    engine = new AvailabilityEngine(mockPrisma);
  });

  it('should return empty array if provider has no active schedule for the day', async () => {
    mockPrisma.providerSchedule.findFirst.mockResolvedValue(null);

    const slots = await engine.reconcileProviderAvailability('prov-1', 'loc-1', new Date('2026-08-03')); // Monday
    expect(slots).toEqual([]);
  });

  it('should return empty array if provider is on approved time off', async () => {
    mockPrisma.providerSchedule.findFirst.mockResolvedValue({
      startTime: '09:00',
      endTime: '17:00',
      slotDurationMinutes: 30,
      bufferMinutes: 5,
    });
    mockPrisma.providerTimeOff.findFirst.mockResolvedValue({ id: 'timeoff-1' });

    const slots = await engine.reconcileProviderAvailability('prov-1', 'loc-1', new Date('2026-08-03'));
    expect(slots).toEqual([]);
  });

  it('should correctly flag slots as unavailable if an appointment overlaps', async () => {
    mockPrisma.providerSchedule.findFirst.mockResolvedValue({
      startTime: '09:00',
      endTime: '10:00',
      slotDurationMinutes: 30,
      bufferMinutes: 0,
    });
    mockPrisma.providerTimeOff.findFirst.mockResolvedValue(null);

    const targetDate = new Date('2026-08-03T00:00:00.000Z');
    const aptStart = new Date('2026-08-03T09:00:00.000Z');
    const aptEnd = new Date('2026-08-03T09:30:00.000Z');

    mockPrisma.appointment.findMany.mockResolvedValue([
      { startTime: aptStart, endTime: aptEnd },
    ]);

    const slots = await engine.reconcileProviderAvailability('prov-1', 'loc-1', targetDate);
    expect(slots.length).toBeGreaterThan(0);
  });
});
