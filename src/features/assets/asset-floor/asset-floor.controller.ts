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
import { AssetFloorService } from './asset-floor.service';
import { UseJwt } from '../../auth/auth.decorator';
import { UpdateAssetFloorDto } from './dto/update-asset-floor.dto';
import { CreateAssetFloorDto } from './dto/create-asset-floor.dto';

// import { FirebaseService } from '../firebase/firebase.service';

@Controller('asset-floors')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('AssetFloors')
export class AssetFloorController extends BaseController {
  private logger = new Logger(AssetFloorController.name);

  constructor(private readonly assetFloorServices: AssetFloorService) {
    super();
  }

  async UpdateAssetFloor(
    @Body() dto: UpdateAssetFloorDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.assetFloorServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.assetFloorServices.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':assetFloorId')
  async getAssetFloor(@Param('assetFloorId') assetFloorId: string) {
    return await this.run(async () => {
      const result = (
        await this.assetFloorServices.findOne(assetFloorId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createAssetFloor(@Body() dto: CreateAssetFloorDto) {
    try {
      return (await this.assetFloorServices.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':assetFloorId')
  async updateAssetFloor(
    @Param('assetFloorId') accountId: string,
    @Body() dto: UpdateAssetFloorDto,
  ) {
    try {
      return (await this.assetFloorServices.update(accountId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':assetFloorId')
  async deleteAssetFloor(@Param('assetFloorId') assetFloorId: string) {
    return await this.run(async () => {
      return await this.assetFloorServices.deleteOne(assetFloorId);
    });
  }
}
