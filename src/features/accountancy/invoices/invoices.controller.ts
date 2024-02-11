import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindQueryDto } from 'src/common/dto/find-query.dto';
import { genCode, sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { OrdersService } from 'src/features/orders/orders.service';
import { UseJwt } from '../../auth/auth.decorator';
import * as moment from 'moment';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceDocument } from './entities/invoice.entity';
import { ORDER_CREATED_EVENT } from './invoices.handler';
import { InvoicesService } from './invoices.service';
import { CreateTransactionDto } from 'src/features/transactions/dto/create-transaction.dto';
import { TransactionsService } from 'src/features/transactions/transactions.service';
import { TransactionType } from 'src/features/transactions/entities/transaction.entity';
import { throwError } from 'rxjs';
import { CreateTaxItemDto } from './dto/create-tax-item.dto';

@ApiBearerAuth()
@ApiTags('Invoices')
@UseJwt()
@Controller('invoices')
export class InvoicesController extends BaseController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly transactionsService: TransactionsService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreateInvoiceDto, @Req() { user }) {
    try {
      const allInvoices = await this.invoicesService.findAll();
      return await this.run(async () => {
        const invCode =
          'FAC/' + moment().year() + '/' + genCode(allInvoices.length + 1);
        const result = await this.invoicesService.create(
          {
            ...dto,
            creator: user._id,
            code: invCode,
          },
          dto.announcer,
        );

        this.event.emit(ORDER_CREATED_EVENT, {
          code: invCode,
          accountId: user._id,
          completed: true,
        });

        return result;
      });
    } catch (error) {
      sendError(error);
    }
  }

  @Get()
  async getAllInvoices(
    @Req() { user },
    @Query() { states }: FindQueryDto<InvoiceDocument>,
  ) {
    try {
      const data = await this.invoicesService.find();
      const totalItems = data.length;
      const totalAnnouncers = data.map((e) => {
        return e.announcer['_id'];
      });
      const totalAnnouncersSet = new Set(totalAnnouncers);
      const totalSpots = 0;
      const totalFiles = 0;

      return {
        metaData: {
          totalItems,
          totalAnnouncers: 0,
          totalSpots,
          totalFiles,
        },
        data,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @Get(':invoiceId')
  async getPackage(@Param('invoiceId') invoiceId: string, @Req() { user }) {
    try {
      return await this.invoicesService.findOne(invoiceId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':invoiceId/addPayment')
  async addPayment(
    @Param('invoiceId') invoiceId: string,
    @Body() dto: CreateTransactionDto,
    @Req() { user },
  ) {
    try {
      const allTxns = await this.transactionsService.findAllTransactions();
      const txn = await this.transactionsService.create({
        ...dto,
        code: 'REG/' + moment().year() + '/' + genCode(allTxns.length + 1),
        type: TransactionType.sales,
        author: user._id,
      });
      if (txn) {
        const inv = await this.invoicesService.findOne(invoiceId);
        this.invoicesService.updatePaidAmount(invoiceId, txn.amount + inv.paid);
        return await this.invoicesService.addPayment(invoiceId, txn._id);
      }
      throwError;
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':invoiceId/addTax')
  async addTax(
    @Param('invoiceId') invoiceId: string,
    @Body() dto: CreateTaxItemDto,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.addTax(invoiceId, dto);
      throwError;
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':invoiceId')
  async updatePackage(
    @Param('invoiceId') invoiceId: string,
    @Body() dto: UpdateInvoiceDto,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.updateOne(invoiceId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':invoiceId/close')
  async closePackage(@Param('invoiceId') invoiceId: string, @Req() { user }) {
    try {
      return await this.invoicesService.closePackage(invoiceId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':invoiceId/reopen')
  async reopenPackage(@Param('invoiceId') invoiceId: string, @Req() { user }) {
    try {
      return await this.invoicesService.reopenPackage(invoiceId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':invoiceId/doit')
  async updateIsDoit(@Param('invoiceId') invoiceId: string, @Req() { user }) {
    try {
      const oneInvoice = await this.invoicesService.findOneNoPopulate(
        invoiceId,
      );
      return await this.invoicesService.updateIsDoit(
        invoiceId,
        -(oneInvoice.amount ?? 0),
        -(oneInvoice.amountHT ?? 0),
        -(oneInvoice.tva ?? 0),
        -(oneInvoice.tsp ?? 0),
      );
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':invoiceId/copy')
  async copyInvoice(@Param('invoiceId') invoiceId: string, @Req() { user }) {
    try {
      const allInvoices = await this.invoicesService.findAll();
      const oneInvoice = await this.invoicesService.findOneNoPopulate(
        invoiceId,
      );

      return await this.run(async () => {
        const invCode =
          'FAC/' + moment().year() + '/' + genCode(allInvoices.length + 1);
        const result = await this.invoicesService.create(
          {
            code: invCode,
            from: invoiceId,
            date: oneInvoice.date,
            dueDate: oneInvoice.dueDate,
            org: oneInvoice.org?.toString(),
            order: oneInvoice.order?.toString(),
            items: oneInvoice.items,
            description: oneInvoice.description,
            manager: oneInvoice.manager?.toString(),
            paymentCondition: oneInvoice.paymentCondition?.toString(),
            paymentMethod: oneInvoice.paymentMethod?.toString(),
            validator: oneInvoice.validator?.toString(),
            paid: oneInvoice.paid,
            tsp: oneInvoice.tsp,
            tva: oneInvoice.tva,
            team: oneInvoice.team,
            transactions: oneInvoice.transactions.map((e) => e.toString()),
            amount: oneInvoice.amount,
            amountHT: oneInvoice.amountHT,
            creator: user._id,
            isDoit: true,
            label: oneInvoice.label,
            requiredAdminValidator: false,
            expectedAdminValidator:
              oneInvoice.expectedAdminValidator?.toString(),
            announcer: oneInvoice.announcer?.toString(),
            status: oneInvoice.status,
            closed: oneInvoice.closed,
          },
          oneInvoice.announcer?.toString(),
        );

        this.event.emit(ORDER_CREATED_EVENT, {
          code: invCode,
          accountId: user._id,
          completed: true,
        });

        return result;
      });
    } catch (error) {
      sendError(error);
    }
  }

  @Delete(':invoiceId')
  async deleteInvoice(@Param('invoiceId') invoiceId: string, @Req() { user }) {
    try {
      const invoice = await this.invoicesService.findOne(invoiceId);
      return await this.invoicesService.deleteOne(invoiceId);
    } catch (error) {
      sendError(error);
    }
  }
}
