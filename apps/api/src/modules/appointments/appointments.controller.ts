import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission, AppointmentStatus } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @RequirePermissions(Permission.APPOINTMENT_CREATE)
  @ApiOperation({ summary: 'Schedule a clinical visit with conflict prevention' })
  scheduleAppointment(@Body() dto: CreateAppointmentDto, @CurrentUser() user: UserPayload) {
    return this.appointmentsService.scheduleClinicalVisit(user.organizationId, dto);
  }

  @Get('slots')
  @RequirePermissions(Permission.APPOINTMENT_READ)
  @ApiOperation({ summary: 'Reconcile provider availability for a target date' })
  getSlots(
    @Query('providerId') providerId: string,
    @Query('locationId') locationId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentsService.getAvailableSlots(providerId, locationId, date);
  }

  @Get()
  @RequirePermissions(Permission.APPOINTMENT_READ)
  @ApiOperation({ summary: 'List appointments with filter options' })
  listAppointments(
    @CurrentUser() user: UserPayload,
    @Query('providerId') providerId?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: AppointmentStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.listAppointments(
      user.organizationId,
      providerId,
      patientId,
      status,
      startDate,
      endDate,
    );
  }

  @Patch(':id/status')
  @RequirePermissions(Permission.APPOINTMENT_UPDATE)
  @ApiOperation({ summary: 'Transition appointment status (check-in, complete, cancel)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
    @CurrentUser() user: UserPayload,
  ) {
    return this.appointmentsService.updateAppointmentStatus(
      id,
      user.organizationId,
      dto,
      user.id,
    );
  }
}
