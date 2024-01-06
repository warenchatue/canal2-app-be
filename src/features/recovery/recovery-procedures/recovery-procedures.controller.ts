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
import { CreateRecoveryProcedureDto } from './dto/create-recovery-procedure.dto';
import { UpdateRecoveryProcedureDto } from './dto/update-recovery-procedure.dto';
import { RecoveryProcedureDocument } from './entities/recovery-procedure.entity';
import { ORDER_CREATED_EVENT } from './recovery-procedures.handler';
import { RecoveryProceduresService } from './recovery-procedures.service';
import { CreateTransactionDto } from 'src/features/transactions/dto/create-transaction.dto';
import { TransactionsService } from 'src/features/transactions/transactions.service';
import { TransactionType } from 'src/features/transactions/entities/transaction.entity';
import { throwError } from 'rxjs';

@ApiBearerAuth()
@ApiTags('RecoveryProcedures')
@UseJwt()
@Controller('invoices')
export class RecoveryProceduresController extends BaseController {
  constructor(
    private readonly invoicesService: RecoveryProceduresService,
    private readonly ordersServices: OrdersService,
    private readonly transactionsService: TransactionsService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreateRecoveryProcedureDto, @Req() { user }) {
    try {
      const allRecoveryProcedures = await this.invoicesService.findAll();
      return await this.run(async () => {
        const invCode =
          'FAC/' +
          moment().year() +
          '/' +
          genCode(allRecoveryProcedures.length + 1);
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
  async getAllRecoveryProcedures(
    @Req() { user },
    @Query() { states }: FindQueryDto<RecoveryProcedureDocument>,
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

  @Get(':recoveryProcedureId')
  async getPackage(
    @Param('recoveryProcedureId') recoveryProcedureId: string,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.findOne(recoveryProcedureId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':recoveryProcedureId/addPayment')
  async addPayment(
    @Param('recoveryProcedureId') recoveryProcedureId: string,
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
        const inv = await this.invoicesService.findOne(recoveryProcedureId);
        this.invoicesService.updatePaidAmount(
          recoveryProcedureId,
          txn.amount + inv.paid,
        );
        return await this.invoicesService.addPayment(
          recoveryProcedureId,
          txn._id,
        );
      }
      throwError;
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':recoveryProcedureId')
  async updatePackage(
    @Param('recoveryProcedureId') recoveryProcedureId: string,
    @Body() dto: UpdateRecoveryProcedureDto,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.updateOne(recoveryProcedureId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':recoveryProcedureId/close')
  async closePackage(
    @Param('recoveryProcedureId') recoveryProcedureId: string,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.closePackage(recoveryProcedureId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':recoveryProcedureId/reopen')
  async reopenPackage(
    @Param('recoveryProcedureId') recoveryProcedureId: string,
    @Req() { user },
  ) {
    try {
      return await this.invoicesService.reopenPackage(recoveryProcedureId);
    } catch (error) {
      sendError(error);
    }
  }

  @Delete(':recoveryProcedureId')
  async deleteRecoveryProcedure(
    @Param('recoveryProcedureId') recoveryProcedureId: string,
    @Req() { user },
  ) {
    try {
      const invoice = await this.invoicesService.findOne(recoveryProcedureId);
      return await this.invoicesService.deleteOne(recoveryProcedureId);
    } catch (error) {
      sendError(error);
    }
  }
}
