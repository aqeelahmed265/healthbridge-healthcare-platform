import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrganizationsController {
  constructor(private readonly orgsService: OrganizationsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Retrieve authenticated tenant organization profile' })
  getProfile(@CurrentUser() user: UserPayload) {
    return this.orgsService.getOrganizationProfile(user.organizationId);
  }

  @Get('locations')
  @ApiOperation({ summary: 'List clinic locations for organization' })
  listLocations(@CurrentUser() user: UserPayload) {
    return this.orgsService.listClinicLocations(user.organizationId);
  }

  @Get('departments')
  @ApiOperation({ summary: 'List departments for organization' })
  listDepartments(@CurrentUser() user: UserPayload) {
    return this.orgsService.listDepartments(user.organizationId);
  }
}
