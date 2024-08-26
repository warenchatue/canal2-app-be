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
import { UseJwt } from '../auth/auth.decorator';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import * as moment from 'moment';
import { PurchaseOrderDocument } from './entities/purchase-order.entity';
import { PURCHASE_ORDER_CREATED_EVENT } from './purchase-orders.handler';
import { PurchaseOrdersService } from './purchase-orders.service';

@ApiBearerAuth()
@ApiTags('PurchaseOrders')
@UseJwt()
@Controller('purchase-orders')
export class PurchaseOrdersController extends BaseController {
  constructor(
    private readonly ordersService: PurchaseOrdersService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreatePurchaseOrderDto, @Req() { user }) {
    try {
      const allPurchaseOrders = await this.ordersService.findAll();
      return await this.run(async () => {
        const devCode =
          'BC/' + moment().year() + '/' + genCode(allPurchaseOrders.length + 1);
        const result = await this.ordersService.create(
          {
            ...dto,
            creator: user._id,
            code: devCode,
          },
          dto.supplier,
        );

        this.event.emit(PURCHASE_ORDER_CREATED_EVENT, {
          code: devCode,
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
  async getAllPurchaseOrders(
    @Req() { user },
    @Query() { states }: FindQueryDto<PurchaseOrderDocument>,
  ) {
    try {
      const data = await this.ordersService.find();
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

  @Get(':orderId')
  async getPurchaseOrder(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      return await this.ordersService.findOne(orderId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId')
  async updatePackage(
    @Param('orderId') orderId: string,
    @Body() dto: UpdatePurchaseOrderDto,
    @Req() { user },
  ) {
    try {
      return await this.ordersService.updateOne(orderId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId/close')
  async closePurchaseOrder(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      return await this.ordersService.closePurchaseOrder(orderId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId/reopen')
  async reopenPurchaseOrder(
    @Param('orderId') orderId: string,
    @Req() { user },
  ) {
    try {
      return await this.ordersService.reopenPurchaseOrder(orderId);
    } catch (error) {
      sendError(error);
    }
  }

  @Delete(':orderId')
  async deletePurchaseOrder(
    @Param('orderId') orderId: string,
    @Req() { user },
  ) {
    try {
      const order = await this.ordersService.findOne(orderId);
      return await this.ordersService.deleteOne(orderId);
    } catch (error) {
      sendError(error);
    }
  }
}
