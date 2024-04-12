import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { genCode, sendError } from 'src/common/helpers';
import { UseJwt } from '../auth/auth.decorator';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';
import * as moment from 'moment';
import { InvoicesService } from '../accountancy/invoices/invoices.service';
import { BaseController } from 'src/common/shared/base-controller';
import { State } from 'src/common/shared/base-schema';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController extends BaseController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly invoicesService: InvoicesService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  findAllTransactions(@Req() req) {
    return this.transactionsService
      .findAllTransactions([State.active])
      .then((result) => result)
      .catch((error) => {
        throw new HttpException(error, 400, { cause: new Error() });
      });
  }

  @Get(':transactionId')
  findOne(@Param('transactionId') transactionId: string) {
    return this.transactionsService
      .findOne(transactionId, true)
      .then((result) => result)
      .catch((error) => {
        throw new NotFoundException(error);
      });
  }

  @ApiQuery({
    name: 'author',
    required: false,
  })
  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async create(
    @Body() dto: CreateTransactionDto,
    @Req() req,
    @Query('author') author: string = null,
  ) {
    const allTxns = await this.transactionsService.findAllTransactions();

    return await this.transactionsService
      .create({
        ...dto,
        code: 'REG/' + moment().year() + '/' + genCode(allTxns.length + 1),
        author: author ? author : req.user ? req.user._id : null,
      })
      .then((result) => {
        this.event.emit('transaction.create.succeed', result.toJSON());
        return result;
      })
      .catch((error) => {
        this.event.emit('transaction.create.failed', error);
        throw new HttpException(error, 500);
      });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Patch(':transactionId')
  update(
    @Param('transactionId') transactionId: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService
      .update(transactionId, dto)
      .then((result) => result)
      .catch((error) => {
        throw new HttpException(error, 500);
      });
  }

  @Delete(':transactionId/with-invoice')
  async deleteWithInvoice(
    @Param('transactionId') transactionId: string,
    @Req() { user },
  ) {
    try {
      const oneTxn = await this.transactionsService.findOne(transactionId);
      const invData = { ...oneTxn.data } as any;
      const oneInvoice = await this.invoicesService.findOne(invData.invoiceId);
      await this.invoicesService.pullPayment(
        invData.invoiceId ?? '',
        transactionId,
      );

      const invoice2 = await this.invoicesService.updatePaid(
        invData.invoiceId ?? '',
        oneInvoice.isDoit
          ? oneInvoice.paid - oneTxn.amount
          : oneInvoice.paid + -oneTxn.amount,
      );

      if (invoice2) {
        const transaction = await this.transactionsService.deleteOne(
          transactionId,
        );
        return transaction;
      }
      return oneTxn;
    } catch (error) {
      sendError(error);
    }
  }
}

@ApiTags('Transactions')
@ApiBearerAuth()
@UseJwt()
@Controller('org/:orgId/transactions')
export class OrgTransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    description: 'Returns the list of transactions made in the provided org',
  })
  @Get()
  findTransactionsByGroup(@Param('orgId') orgId: string) {
    return this.transactionsService
      .findTransactionsByGroup(orgId)
      .then((result) => result)
      .catch((error) => {
        throw new HttpException(error, 500);
      });
  }

  @Put(':transactionId/approve')
  async approve(
    @Param('orgId') orgId: string,
    @Param('transactionId') transactionId: string,
    @Req() { user },
  ) {
    try {
      const accountId = user._id;
      // if (
      //   !(await this.transactionsService.isValidatorOf(
      //     accountId,
      //     transactionId,
      //   ))
      // )
      //   throw new ForbiddenException('MUST_BE_VALIDATOR');
      return this.transactionsService.approveTransaction(transactionId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':transactionId/reject')
  async rejectDeposit(
    @Param('orgId') orgId: string,
    @Param('transactionId') transactionId: string,
    @Req() { user },
  ) {
    try {
      const accountId = user._id;
      const transaction = await this.transactionsService.rejectTransaction(
        transactionId,
      );

      return transaction;
    } catch (error) {
      sendError(error);
    }
  }
  @Delete(':transactionId')
  async delete(
    @Param('orgId') orgId: string,
    @Param('transactionId') transactionId: string,
    @Req() { user },
  ) {
    try {
      const transaction = await this.transactionsService.deleteOne(
        transactionId,
      );

      return transaction;
    } catch (error) {
      sendError(error);
    }
  }
}
