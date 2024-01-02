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
import { UpdateTaxDto } from './dto/update-tax.dto';
import { TaxesService } from './taxes.service';
import { CreateTaxDto } from './dto/create-tax.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('taxes')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Taxes')
export class TaxesController extends BaseController {
  private logger = new Logger(TaxesController.name);

  constructor(private readonly taxesServices: TaxesService) {
    super();
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
        return json;
      });

      return final_result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':taxId')
  async getAccount(@Param('taxId') taxId: string) {
    return await this.run(async () => {
      const result = (await this.taxesServices.findOne(taxId)).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createTax(@Body() dto: CreateTaxDto) {
    try {
      const tax = await (await this.taxesServices.create(dto)).toJSON();
      return tax;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':taxId')
  async updateTax(
    @Param('taxId') accountId: string,
    @Body() dto: UpdateTaxDto,
  ) {
    try {
      const tax = await (
        await this.taxesServices.update(accountId, dto)
      ).toJSON();
      return tax;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':taxId')
  async deleteTax(@Param('taxId') taxId: string, @Req() { user }: URequest) {
    return await this.run(async () => {
      return await this.taxesServices.deleteOne(taxId);
    });
  }
}
