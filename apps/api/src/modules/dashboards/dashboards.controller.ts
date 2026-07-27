import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardsService } from './dashboards.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Dashboards')
@Controller('dashboards')
@UseGuards(JwtAuthGuard)
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('admin')
  @ApiOperation({ summary: 'Get clinic administrator aggregate metrics' })
  getAdminMetrics(@CurrentUser() user: UserPayload) {
    return this.dashboardsService.getAdminMetrics(user.organizationId);
  }

  @Get('doctor')
  @ApiOperation({ summary: 'Get doctor clinical metrics' })
  getDoctorMetrics(@CurrentUser() user: UserPayload) {
    return this.dashboardsService.getDoctorMetrics(user.providerId || '', user.organizationId);
  }

  @Get('patient')
  @ApiOperation({ summary: 'Get patient portal metrics' })
  getPatientMetrics(@CurrentUser() user: UserPayload) {
    return this.dashboardsService.getPatientMetrics(user.patientId || '', user.organizationId);
  }
}
