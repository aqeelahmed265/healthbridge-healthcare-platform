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
import { CarePlansService } from './careplans.service';
import { CreateCarePlanDto } from './dto/create-careplan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission, UserRole, CarePlanStatus } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Care Plans')
@Controller('care-plans')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CarePlansController {
  constructor(private readonly carePlansService: CarePlansService) {}

  @Post()
  @RequirePermissions(Permission.CAREPLAN_CREATE)
  @ApiOperation({ summary: 'Create a clinical care plan with goals and milestones' })
  createCarePlan(@Body() dto: CreateCarePlanDto, @CurrentUser() user: UserPayload) {
    return this.carePlansService.createCarePlan(user.organizationId, dto);
  }

  @Get()
  @RequirePermissions(Permission.CAREPLAN_READ)
  @ApiOperation({ summary: 'List care plans' })
  listCarePlans(
    @CurrentUser() user: UserPayload,
    @Query('patientId') patientId?: string,
    @Query('status') status?: CarePlanStatus,
  ) {
    return this.carePlansService.listCarePlans(user.organizationId, patientId, status);
  }

  @Get(':id')
  @RequirePermissions(Permission.CAREPLAN_READ)
  @ApiOperation({ summary: 'Get full care plan details including progress timeline' })
  getCarePlan(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.carePlansService.getCarePlanDetails(id, user.organizationId);
  }

  @Patch('milestones/:milestoneId/complete')
  @RequirePermissions(Permission.CAREPLAN_TASK_UPDATE)
  @ApiOperation({ summary: 'Mark milestone completed and recalculate care plan progress' })
  completeMilestone(@Param('milestoneId') milestoneId: string, @CurrentUser() user: UserPayload) {
    return this.carePlansService.markMilestoneCompleted(milestoneId, user.organizationId);
  }

  @Post(':id/progress')
  @RequirePermissions(Permission.CAREPLAN_TASK_UPDATE)
  @ApiOperation({ summary: 'Submit progress update for care plan' })
  recordProgress(
    @Param('id') id: string,
    @Body('notes') notes: string,
    @CurrentUser() user: UserPayload,
  ) {
    const updatedBy = `${user.firstName} ${user.lastName}`;
    return this.carePlansService.recordProgressEntry(id, user.organizationId, updatedBy, notes);
  }
}
