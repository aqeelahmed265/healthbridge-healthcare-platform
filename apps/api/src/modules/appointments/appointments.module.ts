import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { AvailabilityEngine } from './availability.engine';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AvailabilityEngine],
  exports: [AppointmentsService, AvailabilityEngine],
})
export class AppointmentsModule {}
