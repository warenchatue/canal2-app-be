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
import { UseJwt } from '../auth/auth.decorator';
import { CountriesService } from './countries.service';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CreateCountryDto } from './dto/create-country.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('countries')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Countries')
export class CountriesController extends BaseController {
  private logger = new Logger(CountriesController.name);

  constructor(private readonly countriesService: CountriesService) {
    super();
  }

  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.countriesService.findAll();
      const final_result = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        return json;
      });

      return final_result;
    });
  }

  @Get(':countryId')
  async getAccount(@Param('countryId') countryId: string) {
    return await this.run(async () => {
      const result = (await this.countriesService.findOne(countryId)).toJSON();
      console.log(result);
      return _.omit(result, ['password', 'notifications']);
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createCountry(@Body() dto: CreateCountryDto) {
    try {
      const role = await (await this.countriesService.create(dto)).toJSON();
      return role;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':countryId')
  async updateAccount(
    @Param('countryId') accountId: string,
    @Body() dto: UpdateCountryDto,
    @Req() { user },
  ) {
    try {
      const role = await (
        await this.countriesService.update(accountId, dto)
      ).toJSON();
      return {
        firstName: role.name,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':countryId')
  async deleteCountry(
    @Param('countryId') countryId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.countriesService.deleteOne(countryId);
    });
  }
}
