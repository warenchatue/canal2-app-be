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
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import * as moment from 'moment';
import { OrderDocument } from './entities/order.entity';
import { ORDER_CREATED_EVENT } from './orders.handler';
import { OrdersService } from './orders.service';
import { State } from 'src/common/shared/base-schema';

@ApiBearerAuth()
@ApiTags('Orders')
@UseJwt()
@Controller('orders')
export class OrdersController extends BaseController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() { user }) {
    try {
      const allOrders = await this.ordersService.findAll();
      return await this.run(async () => {
        const devCode =
          'DEV/' + moment().year() + '/' + genCode(allOrders.length + 1);
        const result = await this.ordersService.create(
          {
            ...dto,
            creator: user._id,
            code: devCode,
          },
          dto.announcer,
        );

        this.event.emit(ORDER_CREATED_EVENT, {
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
  async getAllOrders(
    @Req() { user },
    @Query() { states }: FindQueryDto<OrderDocument>,
  ) {
    try {
      const data = await this.ordersService.find();
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

  @Get('/paginate')
  async getAllOrdersPaginate(
    @Req() {},
    @Query() query: FindQueryDto<OrderDocument>,
  ) {
    try {
      const data = await this.ordersService.findPaginate(query);
      const totalItems = await this.ordersService.countTotal();

      return {
        stats: {
          totalItems,
          totalAnnouncers: 0,
        },
        results: data,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      return await this.ordersService.findOne(orderId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId/copy')
  async copyOrder(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      const allOrders = await this.ordersService.findAll();
      const oneOrder = await this.ordersService.findOneNoPopulate(orderId);

      return await this.run(async () => {
        const orderCode =
          'DEV/' + moment().year() + '/' + genCode(allOrders.length + 1);
        const result = await this.ordersService.create(
          {
            code: orderCode,
            from: orderId,
            date: oneOrder.date,
            dueDate: oneOrder.dueDate,
            org: oneOrder.org?.toString(),
            items: oneOrder.items,
            description: oneOrder.description,
            manager: oneOrder.manager?.toString(),
            paymentCondition: oneOrder.paymentCondition?.toString(),
            paymentMethod: oneOrder.paymentMethod?.toString(),
            validator: oneOrder.validator?.toString(),
            team: oneOrder.team,
            amount: oneOrder.amount,
            creator: user._id,
            label: oneOrder.label,
            requiredAdminValidator: false,
            expectedAdminValidator: oneOrder.expectedAdminValidator?.toString(),
            announcer: oneOrder.announcer?.toString(),
            status: oneOrder.status,
            closed: oneOrder.closed,
          },
          oneOrder.announcer?.toString(),
        );

        this.event.emit(ORDER_CREATED_EVENT, {
          code: orderCode,
          accountId: user._id,
          completed: true,
        });

        return result;
      });
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId')
  async updatePackage(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
    @Req() { user },
  ) {
    try {
      return await this.ordersService.updateOne(orderId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId/close')
  async closeOrder(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      return await this.ordersService.closeOrder(orderId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId/reopen')
  async reopenOrder(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      return await this.ordersService.reopenOrder(orderId);
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get('/all/by/code')
  async getOrderByCode(@Query('orderCode') orderCode: string) {
    return await this.run(async () => {
      const result = await this.ordersService.findLightByCode(
        [State.active],
        orderCode,
      );
      return result;
    });
  }

  @Delete(':orderId')
  async deleteOrder(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      const order = await this.ordersService.findOne(orderId);
      return await this.ordersService.deleteOne(orderId);
    } catch (error) {
      sendError(error);
    }
  }
}
