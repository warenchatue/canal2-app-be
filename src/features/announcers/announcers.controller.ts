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
import { genCode, sendError } from 'src/common/helpers';
import { BaseController } from 'src/common/shared/base-controller';
import { URequest } from 'src/common/shared/request';
import { UseJwt } from '../auth/auth.decorator';
import { UpdateAnnouncerDto } from './dto/update-announcer.dto';
import { AnnouncersService } from './announcers.service';
import { CreateAnnouncerDto } from './dto/create-announcer.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('announcers')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Announcers')
export class AnnouncersController extends BaseController {
  private logger = new Logger(AnnouncersController.name);

  constructor(private readonly announcersService: AnnouncersService) {
    super();
  }

  async updateAnnouncer(
    @Body() dto: UpdateAnnouncerDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.announcersService.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.announcersService.find();
      const final_result = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        json['country']['_id'] = json['country']['_id'].toString();
        json['notifications'] = [];
        return json;
      });

      return final_result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':announcerId')
  async getAccount(@Param('announcerId') announcerId: string) {
    return await this.run(async () => {
      const result = (
        await this.announcersService.findOne(announcerId)
      ).toJSON();
      console.log(result);
      return _.omit(result, ['password', 'notifications']);
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createAnnouncer(@Body() dto: CreateAnnouncerDto) {
    try {
      const allAnnouncers = await this.announcersService.findAll();
      const announcer = (
        await this.announcersService.create({
          ...dto,
          code: 'CLT' + genCode(allAnnouncers.length + 1, 5),
        })
      ).toJSON();
      return announcer;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':announcerId')
  async updateAccount(
    @Param('announcerId') accountId: string,
    @Body() dto: UpdateAnnouncerDto,
  ) {
    try {
      const announcer = await (
        await this.announcersService.update(accountId, dto)
      ).toJSON();
      return {
        name: announcer.name,
        phone: announcer.phone,
        type: announcer.type,
      };
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':announcerId')
  async deleteAnnouncer(
    @Param('announcerId') announcerId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.announcersService.deleteOne(announcerId);
    });
  }
}
