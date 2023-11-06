import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../auth/auth.decorator';
import { OrdersService } from '../orders/orders.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './products.service';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Products')
export class SpotsController extends BaseController {
  private logger = new Logger(SpotsController.name);

  constructor(
    private readonly productService: ProductService,
    private readonly ordersService: OrdersService,
  ) {
    super();
  }

  async updateSpot(@Body() dto: UpdateProductDto, @Req() { user }: URequest) {
    return await this.run(
      async () => await this.productService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = (await this.productService.findActive()).map((e) => {
        const result = e.toJSON();
        result['_id'] = result['_id'].toString();
        result['order']['_id'] = result['order']['_id'].toString();
        return result;
      });

      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':spotId')
  async getAccount(@Param('spotId') spotId: string) {
    return await this.run(async () => {
      const result = (await this.productService.findOne(spotId)).toJSON();
      result['_id'] = result['_id'].toString();
      result['order']['_id'] = result['order']['_id'].toString();
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createSpot(@Body() dto: CreateProductDto) {
    try {
      const spot = await await this.productService.create(dto);
      await this.ordersService.addProduct(dto.order, spot._id.toString());
      return spot.toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':spotId')
  async updateAccount(
    @Param('spotId') accountId: string,
    @Body() dto: UpdateProductDto,
  ) {
    try {
      const spot = await (
        await this.productService.update(accountId, dto)
      ).toJSON();
      return spot;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':spotId')
  async deleteSpot(@Param('spotId') spotId: string, @Req() { user }: URequest) {
    return await this.run(async () => {
      try {
        const spot = (await this.productService.findOne(spotId)).toJSON();
        const response = await this.productService.deleteOne(spotId);
        await this.ordersService.pullProduct(
          spot['order']['_id'].toString(),
          spotId,
        );
        return response;
      } catch (error) {
        sendError(error);
      }
    });
  }
}
