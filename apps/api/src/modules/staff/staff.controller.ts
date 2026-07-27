import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Staff & Providers')
@Controller('staff')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @ApiOperation({ summary: 'List all staff members for organization' })
  listStaff(@CurrentUser() user: UserPayload) {
    return this.staffService.listStaffMembers(user.organizationId);
  }

  @Get('providers')
  @ApiOperation({ summary: 'List all healthcare providers' })
  listProviders(@CurrentUser() user: UserPayload) {
    return this.staffService.listProviders(user.organizationId);
  }

  @Get('providers/:id')
  @ApiOperation({ summary: 'Get provider profile by ID' })
  getProvider(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.staffService.getProviderProfile(id, user.organizationId);
  }
}
