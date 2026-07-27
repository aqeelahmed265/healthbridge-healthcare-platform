import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PrescriptionItemDto {
  @IsString()
  @IsNotEmpty()
  medicationName!: string;

  @IsString()
  @IsNotEmpty()
  dosage!: string; // 1 tablet, 10ml

  @IsString()
  @IsNotEmpty()
  frequency!: string; // Twice daily

  @IsString()
  @IsNotEmpty()
  route!: string; // Oral

  @IsNumber()
  refills!: number;

  @IsString()
  @IsNotEmpty()
  instructions!: string;
}

export class CreatePrescriptionDto {
  @IsUUID()
  @IsNotEmpty()
  patientId!: string;

  @IsUUID()
  @IsNotEmpty()
  providerId!: string;

  @IsOptional()
  @IsUUID()
  encounterId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items!: PrescriptionItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
