import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @RequirePermissions(Permission.PATIENT_CREATE)
  @ApiOperation({ summary: 'Register a new patient and assign internal MRN' })
  registerPatient(@Body() dto: CreatePatientDto, @CurrentUser() user: UserPayload) {
    return this.patientsService.registerClinicPatient(user.organizationId, dto);
  }

  @Get()
  @RequirePermissions(Permission.PATIENT_READ)
  @ApiOperation({ summary: 'List and search patients with pagination' })
  listPatients(
    @CurrentUser() user: UserPayload,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.patientsService.listPatients(user.organizationId, search, page, limit);
  }

  @Get(':id')
  @RequirePermissions(Permission.PATIENT_READ)
  @ApiOperation({ summary: 'Retrieve full patient profile details' })
  getPatient(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.patientsService.getPatientProfile(id, user.organizationId);
  }

  @Get(':id/timeline')
  @RequirePermissions(Permission.PATIENT_READ)
  @ApiOperation({ summary: 'Assemble consolidated patient medical timeline' })
  getTimeline(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.patientsService.assemblePatientTimeline(id, user.organizationId);
  }
}
