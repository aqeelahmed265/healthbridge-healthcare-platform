import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInvoiceDto, RecordPaymentDto, ProcessRefundDto } from './dto/create-invoice.dto';
import { formatInvoiceNumber, InvoiceStatus } from '@healthbridge/shared';
import Decimal from 'decimal.js';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async constructInvoiceLedger(organizationId: string, dto: CreateInvoiceDto) {
    const invoiceCount = await this.prisma.invoice.count({
      where: { organizationId },
    });

    const invoiceNumber = formatInvoiceNumber(new Date(), invoiceCount + 1);

    // Calculate subtotal with Decimal.js
    let subtotalDec = new Decimal(0);
    const itemRecords = dto.items.map((item) => {
      const qtyDec = new Decimal(item.quantity);
      const unitDec = new Decimal(item.unitPrice);
      const totalDec = qtyDec.times(unitDec);
      subtotalDec = subtotalDec.plus(totalDec);

      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: unitDec.toFixed(2),
        totalPrice: totalDec.toFixed(2),
      };
    });

    const discountDec = new Decimal(dto.discount || 0);
    const taxRateDec = new Decimal(dto.taxRate || 0);
    const taxDec = subtotalDec.minus(discountDec).times(taxRateDec);
    const totalAmountDec = subtotalDec.minus(discountDec).plus(taxDec);

    return this.prisma.invoice.create({
      data: {
        organizationId,
        invoiceNumber,
        patientId: dto.patientId,
        status: InvoiceStatus.ISSUED,
        dueDate: new Date(dto.dueDate),
        subtotal: subtotalDec.toFixed(2),
        tax: taxDec.toFixed(2),
        discount: discountDec.toFixed(2),
        totalAmount: totalAmountDec.toFixed(2),
        paidAmount: '0.00',
        notes: dto.notes,
        items: {
          create: itemRecords,
        },
      },
      include: {
        patient: true,
        items: true,
        payments: true,
      },
    });
  }

  async listInvoices(organizationId: string, patientId?: string, status?: InvoiceStatus) {
    const where: any = { organizationId };
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    return this.prisma.invoice.findMany({
      where,
      include: {
        patient: true,
        items: true,
        payments: true,
        refunds: true,
      },
      orderBy: { issueDate: 'desc' },
    });
  }

  async getInvoiceDetails(id: string, organizationId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, organizationId },
      include: {
        patient: true,
        items: true,
        payments: true,
        refunds: true,
      },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async recordInvoicePayment(organizationId: string, dto: RecordPaymentDto) {
    const invoice = await this.getInvoiceDetails(dto.invoiceId, organizationId);

    const currentPaidDec = new Decimal(invoice.paidAmount.toString());
    const totalDec = new Decimal(invoice.totalAmount.toString());
    const paymentDec = new Decimal(dto.amount);

    const newPaidDec = currentPaidDec.plus(paymentDec);

    if (newPaidDec.greaterThan(totalDec)) {
      throw new BadRequestException(
        `Payment amount ($${paymentDec.toFixed(2)}) exceeds remaining invoice balance ($${totalDec.minus(currentPaidDec).toFixed(2)})`,
      );
    }

    let newStatus: InvoiceStatus = InvoiceStatus.PARTIALLY_PAID;
    if (newPaidDec.equals(totalDec)) {
      newStatus = InvoiceStatus.PAID;
    }

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId: dto.invoiceId,
          amount: paymentDec.toFixed(2),
          method: dto.method,
          transactionRef: dto.transactionRef,
          notes: dto.notes,
        },
      });

      const updatedInvoice = await tx.invoice.update({
        where: { id: dto.invoiceId },
        data: {
          paidAmount: newPaidDec.toFixed(2),
          status: newStatus,
        },
        include: { patient: true, items: true, payments: true },
      });

      return {
        payment,
        invoice: updatedInvoice,
      };
    });
  }

  async processRefund(organizationId: string, dto: ProcessRefundDto) {
    const invoice = await this.getInvoiceDetails(dto.invoiceId, organizationId);

    const currentPaidDec = new Decimal(invoice.paidAmount.toString());
    const refundDec = new Decimal(dto.amount);

    if (refundDec.greaterThan(currentPaidDec)) {
      throw new BadRequestException(
        `Refund amount ($${refundDec.toFixed(2)}) cannot exceed total paid amount ($${currentPaidDec.toFixed(2)})`,
      );
    }

    const newPaidDec = currentPaidDec.minus(refundDec);
    const newStatus: InvoiceStatus = newPaidDec.equals(0)
      ? InvoiceStatus.ISSUED
      : InvoiceStatus.PARTIALLY_PAID;

    return this.prisma.$transaction(async (tx) => {
      const refund = await tx.refund.create({
        data: {
          invoiceId: dto.invoiceId,
          paymentId: dto.paymentId,
          amount: refundDec.toFixed(2),
          reason: dto.reason,
        },
      });

      const updatedInvoice = await tx.invoice.update({
        where: { id: dto.invoiceId },
        data: {
          paidAmount: newPaidDec.toFixed(2),
          status: newStatus,
        },
        include: { patient: true, items: true, payments: true, refunds: true },
      });

      return {
        refund,
        invoice: updatedInvoice,
      };
    });
  }
}
