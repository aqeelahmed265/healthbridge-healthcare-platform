import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto, PrescriptionItemDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission, PrescriptionStatus } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Prescriptions & Pharmacy')
@Controller('prescriptions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PrescriptionsController {
  constructor(private readonly rxService: PrescriptionsService) {}

  @Post()
  @RequirePermissions(Permission.PRESCRIPTION_CREATE)
  @ApiOperation({ summary: 'Issue medication prescription with allergy warning check' })
  issuePrescription(@Body() dto: CreatePrescriptionDto, @CurrentUser() user: UserPayload) {
    return this.rxService.issueMedicationOrder(user.organizationId, dto);
  }

  @Post('check-allergies')
  @RequirePermissions(Permission.PRESCRIPTION_CREATE)
  @ApiOperation({ summary: 'Evaluate allergy warnings for candidate medications' })
  checkAllergies(
    @Query('patientId') patientId: string,
    @Body() items: PrescriptionItemDto[],
  ) {
    return this.rxService.evaluateMedicationAllergies(patientId, items);
  }

  @Get()
  @RequirePermissions(Permission.PRESCRIPTION_READ)
  @ApiOperation({ summary: 'List prescriptions' })
  listPrescriptions(
    @CurrentUser() user: UserPayload,
    @Query('patientId') patientId?: string,
    @Query('status') status?: PrescriptionStatus,
  ) {
    return this.rxService.listPrescriptions(user.organizationId, patientId, status);
  }

  @Patch(':id/discontinue')
  @RequirePermissions(Permission.PRESCRIPTION_DISCONTINUE)
  @ApiOperation({ summary: 'Discontinue an active prescription' })
  discontinue(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: UserPayload,
  ) {
    return this.rxService.discontinuePrescription(id, user.organizationId, reason);
  }
}
