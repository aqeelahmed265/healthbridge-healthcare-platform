import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EncountersService } from './encounters.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Clinical Encounters')
@Controller('encounters')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EncountersController {
  constructor(private readonly encountersService: EncountersService) {}

  @Post()
  @RequirePermissions(Permission.ENCOUNTER_CREATE)
  @ApiOperation({ summary: 'Create a new clinical encounter note with vitals & diagnoses' })
  createEncounter(@Body() dto: CreateEncounterDto, @CurrentUser() user: UserPayload) {
    return this.encountersService.createEncounter(user.organizationId, dto);
  }

  @Get()
  @RequirePermissions(Permission.ENCOUNTER_READ)
  @ApiOperation({ summary: 'List clinical encounters' })
  listEncounters(
    @CurrentUser() user: UserPayload,
    @Query('patientId') patientId?: string,
    @Query('providerId') providerId?: string,
  ) {
    return this.encountersService.listEncounters(user.organizationId, patientId, providerId);
  }

  @Get(':id')
  @RequirePermissions(Permission.ENCOUNTER_READ)
  @ApiOperation({ summary: 'Retrieve encounter note details' })
  getEncounter(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.encountersService.getEncounterDetails(id, user.organizationId);
  }

  @Patch(':id/sign')
  @RequirePermissions(Permission.ENCOUNTER_UPDATE)
  @ApiOperation({ summary: 'Sign and finalize clinical encounter note' })
  signEncounter(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.encountersService.signEncounter(id, user.organizationId);
  }
}
