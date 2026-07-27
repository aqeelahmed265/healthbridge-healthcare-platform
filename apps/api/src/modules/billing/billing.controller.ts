import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateInvoiceDto, RecordPaymentDto, ProcessRefundDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permission, InvoiceStatus } from '@healthbridge/shared';
import { UserPayload } from '@healthbridge/contracts';

@ApiTags('Billing & Invoices')
@Controller('billing')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('invoices')
  @RequirePermissions(Permission.BILLING_MANAGE)
  @ApiOperation({ summary: 'Construct decimal-precise invoice ledger entry' })
  createInvoice(@Body() dto: CreateInvoiceDto, @CurrentUser() user: UserPayload) {
    return this.billingService.constructInvoiceLedger(user.organizationId, dto);
  }

  @Get('invoices')
  @RequirePermissions(Permission.BILLING_READ)
  @ApiOperation({ summary: 'List invoices' })
  listInvoices(
    @CurrentUser() user: UserPayload,
    @Query('patientId') patientId?: string,
    @Query('status') status?: InvoiceStatus,
  ) {
    return this.billingService.listInvoices(user.organizationId, patientId, status);
  }

  @Get('invoices/:id')
  @RequirePermissions(Permission.BILLING_READ)
  @ApiOperation({ summary: 'Get invoice ledger details' })
  getInvoice(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.billingService.getInvoiceDetails(id, user.organizationId);
  }

  @Post('payments')
  @RequirePermissions(Permission.PAYMENT_RECORD)
  @ApiOperation({ summary: 'Record payment against invoice' })
  recordPayment(@Body() dto: RecordPaymentDto, @CurrentUser() user: UserPayload) {
    return this.billingService.recordInvoicePayment(user.organizationId, dto);
  }

  @Post('refunds')
  @RequirePermissions(Permission.BILLING_MANAGE)
  @ApiOperation({ summary: 'Process refund with balance constraint checking' })
  processRefund(@Body() dto: ProcessRefundDto, @CurrentUser() user: UserPayload) {
    return this.billingService.processRefund(user.organizationId, dto);
  }
}
