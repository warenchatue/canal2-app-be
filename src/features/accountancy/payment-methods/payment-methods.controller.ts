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
import * as _ from 'lodash';
import { sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../../auth/auth.decorator';
import { UpdatePaymentMethodDto } from './dto/update-payment-methods.dto';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-methods.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('payment-methods')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('PaymentMethods')
export class PaymentMethodsController extends BaseController {
  private logger = new Logger(PaymentMethodsController.name);

  constructor(private readonly taxesServices: PaymentMethodsService) {
    super();
  }

  async updateTax(
    @Body() dto: UpdatePaymentMethodDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.taxesServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.taxesServices.find();
      const final_result = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        // json['category']['_id'] = json['category']['_id'].toString();
        return json;
      });

      return final_result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':paymentMethodId')
  async getPaymentMethod(@Param('paymentMethodId') paymentMethodId: string) {
    return await this.run(async () => {
      const result = (
        await this.taxesServices.findOne(paymentMethodId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createTax(@Body() dto: CreatePaymentMethodDto) {
    try {
      const article = await (await this.taxesServices.create(dto)).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':paymentMethodId')
  async updatePaymentMethod(
    @Param('paymentMethodId') paymentMethodId: string,
    @Body() dto: UpdatePaymentMethodDto,
  ) {
    try {
      const article = await (
        await this.taxesServices.update(paymentMethodId, dto)
      ).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':paymentMethodId')
  async deleteTax(
    @Param('paymentMethodId') paymentMethodId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.taxesServices.deleteOne(paymentMethodId);
    });
  }
}
