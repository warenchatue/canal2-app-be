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
import { HoursService } from './hours.service';
import { UpdateHourDto } from './dto/update-hour.dto';
import { CreateHourDto } from './dto/create-hour.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('hours')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Hours')
export class HoursController extends BaseController {
  private logger = new Logger(HoursController.name);

  constructor(private readonly hoursService: HoursService) {
    super();
  }

  async updateHour(@Body() dto: UpdateHourDto, @Req() { user }: URequest) {
    return await this.run(
      async () => await this.hoursService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':hourId')
  async getOne(@Param('hourId') hourId: string) {
    return await this.run(async () => {
      const result = (await this.hoursService.findOne(hourId)).toJSON();
      console.log(result);
      return _.omit(result, ['password', 'notifications']);
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = (await this.hoursService.find()).map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        return json;
      });
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createHour(
    @Body() dto: CreateHourDto,
    // @Req() { user },
  ) {
    try {
      const Hour = await (await this.hoursService.create(dto)).toJSON();
      return Hour;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':hourId')
  async updateAccount(
    @Param('hourId') accountId: string,
    @Body() dto: UpdateHourDto,
    // @Req() { user },
  ) {
    try {
      const Hour = await (
        await this.hoursService.update(accountId, dto)
      ).toJSON();
      return {
        firstName: Hour.name,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':hourId')
  async deleteHour(@Param('hourId') hourId: string, @Req() { user }: URequest) {
    return await this.run(async () => {
      return await this.hoursService.deleteOne(hourId);
    });
  }
}
