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
import { OrdersService } from './orders.service';
import { PlanningsService } from '../plannings/plannings.service';
import { ProductService } from '../products/products.service';
import { ORDER_CREATED_EVENT } from './orders.handler';

@ApiBearerAuth()
@ApiTags('Packages')
@UseJwt()
@Controller('packages')
export class PackageController extends BaseController {
  constructor(
    private readonly packagesService: OrdersService,
    private readonly planningsService: PlanningsService,
    private readonly productService: ProductService,
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
  async getAllPackages(
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
      let totalSpots = 0;
      const allSpots = data.map((e) => {
        return e.plannings.length;
      });
      if (allSpots.length > 0) {
        totalSpots = allSpots.reduce(function (a, b) {
          return a + b;
        });
      }
      let totalFiles = 0;
      const allFiles = data.map((e) => {
        return e.products.length;
      });

      if (allFiles.length > 0) {
        totalFiles = allFiles.reduce(function (a, b) {
          return a + b;
        });
      }

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

  @Get(':packageId')
  async getPackage(@Param('packageId') packageId: string, @Req() { user }) {
    try {
      return await this.packagesService.findOne(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':packageId')
  async updatePackage(
    @Param('packageId') packageId: string,
    @Body() dto: UpdateOrderDto,
    @Req() { user },
  ) {
    try {
      return await this.packagesService.updateOne(packageId, dto);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':packageId/close')
  async closePackage(@Param('packageId') packageId: string, @Req() { user }) {
    try {
      return await this.packagesService.closePackage(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @Put(':packageId/reopen')
  async reopenPackage(@Param('packageId') packageId: string, @Req() { user }) {
    try {
      return await this.packagesService.reopenPackage(packageId);
    } catch (error) {
      sendError(error);
    }
  }

  @Delete(':packageId')
  async deletePackage(@Param('packageId') packageId: string, @Req() { user }) {
    try {
      const order = await this.packagesService.findOne(packageId);
      for (let index = 0; index < order.plannings.length; index++) {
        await this.planningsService.deleteOne(
          order.plannings[index]['_id'].toString(),
        );
      }

      for (let index = 0; index < order.products.length; index++) {
        await this.productService.deleteOne(
          order.products[index]['_id'].toString(),
        );
      }
      return await this.packagesService.deleteOne(packageId);
    } catch (error) {
      sendError(error);
    }
  }
}
