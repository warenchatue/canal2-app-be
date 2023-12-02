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
import { UpdatePaymentConditionDto } from './dto/update-payment-condition.dto';
import { PaymentConditionsService } from './payment-conditions.service';
import { CreatePaymentConditionDto } from './dto/create-payment-condition.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('payment-conditions')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('PaymentConditions')
export class PaymentConditionsController extends BaseController {
  private logger = new Logger(PaymentConditionsController.name);

  constructor(private readonly taxesServices: PaymentConditionsService) {
    super();
  }

  async updateTax(
    @Body() dto: UpdatePaymentConditionDto,
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
  @Get(':paymentConditionId')
  async getPaymentCondition(
    @Param('paymentConditionId') paymentConditionId: string,
  ) {
    return await this.run(async () => {
      const result = (
        await this.taxesServices.findOne(paymentConditionId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createTax(@Body() dto: CreatePaymentConditionDto) {
    try {
      const article = await (await this.taxesServices.create(dto)).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':paymentConditionId')
  async updatePaymentCondition(
    @Param('paymentConditionId') paymentConditionId: string,
    @Body() dto: UpdatePaymentConditionDto,
  ) {
    try {
      const article = await (
        await this.taxesServices.update(paymentConditionId, dto)
      ).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':paymentConditionId')
  async deleteTax(
    @Param('paymentConditionId') paymentConditionId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.taxesServices.deleteOne(paymentConditionId);
    });
  }
}
