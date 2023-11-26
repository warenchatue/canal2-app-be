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
import { UseJwt } from '../auth/auth.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDocument } from './entities/order.entity';
import { ORDER_CREATED_EVENT } from './orders.handler';
import { OrdersService } from './orders.service';

@ApiBearerAuth()
@ApiTags('Packages')
@UseJwt()
@Controller('packages')
export class PackageController extends BaseController {
  constructor(
    private readonly packagesService: OrdersService,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  @Post()
  async create(@Body() dto: CreateOrderDto, @Req() { user }) {
    try {
      return await this.run(async () => {
        const result = await this.packagesService.create(
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
  async getAllOrders(
    @Req() { user },
    @Query() { states }: FindQueryDto<OrderDocument>,
  ) {
    try {
      const data = await this.packagesService.find();
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
          totalAnnouncers: totalAnnouncersSet.size,
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
  async getPackage(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      return await this.packagesService.findOne(orderId);
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
      return await this.packagesService.updateOne(orderId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId/close')
  async closePackage(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      return await this.packagesService.closePackage(orderId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':orderId/reopen')
  async reopenPackage(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      return await this.packagesService.reopenPackage(orderId);
    } catch (error) {
      sendError(error);
    }
  }

  @Delete(':orderId')
  async deletePackage(@Param('orderId') orderId: string, @Req() { user }) {
    try {
      const order = await this.packagesService.findOne(orderId);
      return await this.packagesService.deleteOne(orderId);
    } catch (error) {
      sendError(error);
    }
  }
}
