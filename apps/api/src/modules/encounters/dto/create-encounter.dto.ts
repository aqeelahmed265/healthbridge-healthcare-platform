import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VitalReadingDto {
  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  systolicBp?: number;

  @IsOptional()
  @IsNumber()
  diastolicBp?: number;

  @IsOptional()
  @IsNumber()
  heartRate?: number;

  @IsOptional()
  @IsNumber()
  tempCelsius?: number;

  @IsOptional()
  @IsNumber()
  spo2Percent?: number;
}

export class DiagnosisDto {
  @IsString()
  @IsNotEmpty()
  icdCode!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  type?: string;
}

export class CreateEncounterDto {
  @IsUUID()
  @IsNotEmpty()
  patientId!: string;

  @IsUUID()
  @IsNotEmpty()
  providerId!: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsString()
  @IsNotEmpty()
  chiefComplaint!: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  assessment?: string;

  @IsOptional()
  @IsString()
  plan?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => VitalReadingDto)
  vitals?: VitalReadingDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiagnosisDto)
  diagnoses?: DiagnosisDto[];
}
