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
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('taxes')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Taxes')
export class AccountsController extends BaseController {
  private logger = new Logger(AccountsController.name);

  constructor(private readonly taxesServices: AccountsService) {
    super();
  }

  async updateTax(@Body() dto: UpdateAccountDto, @Req() { user }: URequest) {
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
  @Get(':accountId')
  async getAccount(@Param('accountId') accountId: string) {
    return await this.run(async () => {
      const result = (await this.taxesServices.findOne(accountId)).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createTax(@Body() dto: CreateAccountDto) {
    try {
      const article = await (await this.taxesServices.create(dto)).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':accountId')
  async updateAccount(
    @Param('accountId') accountId: string,
    @Body() dto: UpdateAccountDto,
  ) {
    try {
      const article = await (
        await this.taxesServices.update(accountId, dto)
      ).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':accountId')
  async deleteTax(
    @Param('accountId') accountId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.taxesServices.deleteOne(accountId);
    });
  }
}
