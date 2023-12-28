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
import * as moment from 'moment';
import { FindQueryDto } from 'src/common/dto/find-query.dto';
import { genCode, sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { TransactionsService } from 'src/features/transactions/transactions.service';
import { UseJwt } from '../../auth/auth.decorator';
import { ACCOUNTING_DOC_CREATED_EVENT } from './accounting-docs.handler';
import { AccountingDocsService } from './accounting-docs.service';
import { CreateAccountingDocDto } from './dto/create-accounting-docs.dto';
import { UpdateAccountingDocDto } from './dto/update-accounting-doc.dto';
import { AccountingDocDocument } from './entities/accounting-doc.entity';

@ApiBearerAuth()
@ApiTags('AccountingDocs')
@UseJwt()
@Controller('accountingDocs')
export class AccountingDocsController extends BaseController {
  constructor(
    private readonly accountingDocsService: AccountingDocsService,
    private readonly transactionsService: TransactionsService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreateAccountingDocDto, @Req() { user }) {
    try {
      const allAccountingDocs = await this.accountingDocsService.findAll();
      return await this.run(async () => {
        const result = await this.accountingDocsService.create({
          ...dto,
          creator: user._id,
          code:
            'PC/' +
            moment().year() +
            '/' +
            genCode(allAccountingDocs.length + 1),
        });

        this.event.emit(ACCOUNTING_DOC_CREATED_EVENT, {
          code: dto.code,
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
  async getAllAccountingDocs(
    @Req() { user },
    @Query() { states }: FindQueryDto<AccountingDocDocument>,
  ) {
    try {
      const data = await this.accountingDocsService.find();
      const totalItems = data.length;
      const totalSpots = 0;
      const totalFiles = 0;

      return {
        metaData: {
          totalItems,
          totalSpots,
          totalFiles,
        },
        data,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @Get(':accountingDocId')
  async getPackage(
    @Param('accountingDocId') accountingDocId: string,
    @Req() { user },
  ) {
    try {
      return await this.accountingDocsService.findOne(accountingDocId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':accountingDocId')
  async updatePackage(
    @Param('accountingDocId') accountingDocId: string,
    @Body() dto: UpdateAccountingDocDto,
    @Req() { user },
  ) {
    try {
      return await this.accountingDocsService.updateOne(accountingDocId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':accountingDocId/close')
  async closePackage(
    @Param('accountingDocId') accountingDocId: string,
    @Req() { user },
  ) {
    try {
      return await this.accountingDocsService.closePackage(accountingDocId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':accountingDocId/reopen')
  async reopenPackage(
    @Param('accountingDocId') accountingDocId: string,
    @Req() { user },
  ) {
    try {
      return await this.accountingDocsService.reopenPackage(accountingDocId);
    } catch (error) {
      sendError(error);
    }
  }

  @Delete(':accountingDocId')
  async deleteAccountingDoc(
    @Param('accountingDocId') accountingDocId: string,
    @Req() { user },
  ) {
    try {
      const accountingDoc = await this.accountingDocsService.findOne(
        accountingDocId,
      );
      return await this.accountingDocsService.deleteOne(accountingDocId);
    } catch (error) {
      sendError(error);
    }
  }
}
