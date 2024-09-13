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
import { HrPersonnelService } from './hr-personnel.service';
import { UseJwt } from '../../auth/auth.decorator';
import { CreateHrPersonnelDto } from './dto/create-hr-personnel.dto';
import { UpdateHrPersonnelDto } from './dto/update-hr-personnel.dto';

// import { FirebaseService } from '../firebase/firebase.service';

@Controller('assets')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Assets')
export class HrPersonnelController extends BaseController {
  private logger = new Logger(HrPersonnelController.name);

  constructor(private readonly assetServices: HrPersonnelService) {
    super();
  }

  async UpdateAsset(
    @Body() dto: UpdateHrPersonnelDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.assetServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.assetServices.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        json['category']['_id'] = json['category']['_id'].toString();
        json['brand']['_id'] = json['brand']['_id'].toString();
        json['model']['_id'] = json['model']['_id'].toString();
        json['room']['_id'] = json['room']['_id'].toString();
        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':assetId')
  async getAccount(@Param('assetId') assetId: string) {
    return await this.run(async () => {
      const result = (await this.assetServices.findOne(assetId)).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createAsset(@Body() dto: CreateHrPersonnelDto) {
    try {
      return (await this.assetServices.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':assetId')
  async updateAccount(
    @Param('assetId') accountId: string,
    @Body() dto: UpdateHrPersonnelDto,
  ) {
    try {
      return (await this.assetServices.update(accountId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':assetId')
  async deleteAsset(@Param('assetId') assetId: string) {
    return await this.run(async () => {
      return await this.assetServices.deleteOne(assetId);
    });
  }
}
