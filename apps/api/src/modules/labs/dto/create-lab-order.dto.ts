import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { LabResultFlag } from '@healthbridge/shared';

export class CreateLabOrderDto {
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
  @IsUUID(undefined, { each: true })
  labTestIds!: string[];

  @IsOptional()
  @IsString()
  clinicalNotes?: string;
}

export class RecordLabResultDto {
  @IsUUID()
  @IsNotEmpty()
  labOrderItemId!: string;

  @IsString()
  @IsNotEmpty()
  resultValue!: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  referenceRange?: string;

  @IsEnum(LabResultFlag)
  flag!: LabResultFlag;

  @IsString()
  @IsNotEmpty()
  performedBy!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
