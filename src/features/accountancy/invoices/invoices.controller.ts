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
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { UseJwt } from '../../auth/auth.decorator';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceDocument } from './entities/invoice.entity';
import { InvoicesService } from './invoices.service';
import { PlanningsService } from '../../pub/plannings/plannings.service';
import { ProductService } from '../../products/products.service';
import { ORDER_CREATED_EVENT } from './invoices.handler';

@ApiBearerAuth()
@ApiTags('Invoices')
@UseJwt()
@Controller('invoices')
export class PackageController extends BaseController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly planningsService: PlanningsService,
    private readonly productService: ProductService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreateInvoiceDto, @Req() { user }) {
    try {
      return await this.run(async () => {
        const result = await this.invoicesService.create(
          { ...dto, creator: user._id },
          dto.announcer,
        );

        this.event.emit(ORDER_CREATED_EVENT, {
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
}
