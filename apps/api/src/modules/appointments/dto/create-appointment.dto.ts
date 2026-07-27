import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { AppointmentStatus } from '@healthbridge/shared';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  locationId!: string;

  @IsUUID()
  @IsNotEmpty()
  providerId!: string;

  @IsUUID()
  @IsNotEmpty()
  patientId!: string;

  @IsDateString()
  @IsNotEmpty()
  startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  endTime!: string;

  @IsString()
  @IsNotEmpty()
  type!: string; // Consultation, Follow-up, Vaccination

  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status!: AppointmentStatus;

  @IsOptional()
  @IsString()
  cancellationReason?: string;
}
