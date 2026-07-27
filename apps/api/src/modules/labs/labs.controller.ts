import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LabsService } from './labs.service';
import { CreateLabOrderDto, RecordLabResultDto } from './dto/create-lab-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission, LabOrderStatus } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Laboratory Workflows')
@Controller('labs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Get('catalog')
  @RequirePermissions(Permission.LAB_ORDER_READ)
  @ApiOperation({ summary: 'List available laboratory test catalog' })
  getCatalog(@CurrentUser() user: UserPayload) {
    return this.labsService.listLabCatalog(user.organizationId);
  }

  @Post('orders')
  @RequirePermissions(Permission.LAB_ORDER_CREATE)
  @ApiOperation({ summary: 'Create laboratory order for patient' })
  createOrder(@Body() dto: CreateLabOrderDto, @CurrentUser() user: UserPayload) {
    return this.labsService.createLabOrder(user.organizationId, dto);
  }

  @Get('orders')
  @RequirePermissions(Permission.LAB_ORDER_READ)
  @ApiOperation({ summary: 'List laboratory orders' })
  listOrders(
    @CurrentUser() user: UserPayload,
    @Query('patientId') patientId?: string,
    @Query('status') status?: LabOrderStatus,
  ) {
    return this.labsService.listLabOrders(user.organizationId, patientId, status);
  }

  @Post('results')
  @RequirePermissions(Permission.LAB_RESULT_WRITE)
  @ApiOperation({ summary: 'Record lab result and evaluate abnormal flags' })
  recordResult(@Body() dto: RecordLabResultDto, @CurrentUser() user: UserPayload) {
    return this.labsService.recordLabResult(user.organizationId, dto);
  }
}
