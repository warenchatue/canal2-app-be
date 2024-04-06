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
import { UseJwt } from '../../auth/auth.decorator';
import * as moment from 'moment';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { PurchaseInvoiceDocument } from './entities/purchase-invoice.entity';
import { ORDER_CREATED_EVENT } from './purchase-invoices.handler';
import { PurchaseInvoicesService } from './purchase-invoices.service';
import { CreateTransactionDto } from 'src/features/transactions/dto/create-transaction.dto';
import { TransactionsService } from 'src/features/transactions/transactions.service';
import { TransactionType } from 'src/features/transactions/entities/transaction.entity';
import { throwError } from 'rxjs';
import { CreateTaxItemDto } from '../invoices/dto/create-tax-item.dto';

@ApiBearerAuth()
@ApiTags('PurchaseInvoices')
@UseJwt()
@Controller('invoices')
export class PurchaseInvoicesController extends BaseController {
  constructor(
    private readonly invoicesService: PurchaseInvoicesService,
    private readonly transactionsService: TransactionsService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreatePurchaseInvoiceDto, @Req() { user }) {
    try {
      const allPurchaseInvoices = await this.invoicesService.findAll();
      return await this.run(async () => {
        const invCode =
          'FF/' +
          moment().year() +
          '/' +
          genCode(allPurchaseInvoices.length + 1);
        const result = await this.invoicesService.create(
          {
            ...dto,
            creator: user._id,
            code: invCode,
          },
          dto.supplier,
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
  async getAllPurchaseInvoices(
    @Req() { user },
    @Query() { states }: FindQueryDto<PurchaseInvoiceDocument>,
  ) {
    try {
      const data = await this.invoicesService.find();
      const totalItems = data.length;
      const totalAnnouncers = data.map((e) => {
        return e.supplier['_id'];
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

  @Get(':purchaseInvoiceId')
  async getPackage(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.findOne(purchaseInvoiceId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':purchaseInvoiceId/addPayment')
  async addPayment(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
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
        const inv = await this.invoicesService.findOne(purchaseInvoiceId);
        await this.invoicesService.updatePaidAmount(
          purchaseInvoiceId,
          txn.amount + inv.paid,
        );
        await this.invoicesService.addPayment(purchaseInvoiceId, txn._id);
        return await this.invoicesService.findOne(purchaseInvoiceId);
      }
      throwError;
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':purchaseInvoiceId/addTax')
  async addTax(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
    @Body() dto: CreateTaxItemDto,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.addTax(purchaseInvoiceId, dto);
      throwError;
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':purchaseInvoiceId')
  async updatePackage(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
    @Body() dto: UpdatePurchaseInvoiceDto,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.updateOne(purchaseInvoiceId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':purchaseInvoiceId/close')
  async closePackage(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.closePackage(purchaseInvoiceId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':purchaseInvoiceId/reopen')
  async reopenPackage(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.reopenPackage(purchaseInvoiceId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':purchaseInvoiceId/doit')
  async updateIsDoit(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
    @Req() { user },
  ) {
    try {
      const onePurchaseInvoice = await this.invoicesService.findOneNoPopulate(
        purchaseInvoiceId,
      );
      return await this.invoicesService.updateIsDoit(
        purchaseInvoiceId,
        -(onePurchaseInvoice.amount ?? 0),
        -(onePurchaseInvoice.amountHT ?? 0),
        -(onePurchaseInvoice.tva ?? 0),
        -(onePurchaseInvoice.tsp ?? 0),
      );
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':purchaseInvoiceId/copy')
  async copyPurchaseInvoice(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
    @Req() { user },
  ) {
    try {
      const allPurchaseInvoices = await this.invoicesService.findAll();
      const onePurchaseInvoice = await this.invoicesService.findOneNoPopulate(
        purchaseInvoiceId,
      );

      return await this.run(async () => {
        const invCode =
          'FAC/' +
          moment().year() +
          '/' +
          genCode(allPurchaseInvoices.length + 1);
        const result = await this.invoicesService.create(
          {
            code: invCode,
            from: purchaseInvoiceId,
            date: onePurchaseInvoice.date,
            dueDate: onePurchaseInvoice.dueDate,
            org: onePurchaseInvoice.org?.toString(),
            order: onePurchaseInvoice.order?.toString(),
            items: onePurchaseInvoice.items,
            description: onePurchaseInvoice.description,
            manager: onePurchaseInvoice.manager?.toString(),
            paymentCondition: onePurchaseInvoice.paymentCondition?.toString(),
            paymentMethod: onePurchaseInvoice.paymentMethod?.toString(),
            validator: onePurchaseInvoice.validator?.toString(),
            paid: 0,
            tsp: onePurchaseInvoice.tsp,
            tva: onePurchaseInvoice.tva,
            team: onePurchaseInvoice.team,
            // transactions: onePurchaseInvoice.transactions.map((e) => e.toString()),
            transactions: [],
            amount: onePurchaseInvoice.amount,
            amountHT: onePurchaseInvoice.amountHT,
            creator: user._id,
            isDoit: true,
            label: onePurchaseInvoice.label,
            requiredAdminValidator: false,
            expectedAdminValidator:
              onePurchaseInvoice.expectedAdminValidator?.toString(),
            supplier: onePurchaseInvoice.supplier?.toString(),
            status: onePurchaseInvoice.status,
            closed: onePurchaseInvoice.closed,
          },
          onePurchaseInvoice.supplier?.toString(),
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

  @Delete(':purchaseInvoiceId')
  async deletePurchaseInvoice(
    @Param('purchaseInvoiceId') purchaseInvoiceId: string,
    @Req() { user },
  ) {
    try {
      const invoice = await this.invoicesService.findOne(purchaseInvoiceId);
      return await this.invoicesService.deleteOne(purchaseInvoiceId);
    } catch (error) {
      sendError(error);
    }
  }
}
