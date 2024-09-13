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
import { AssetRoomService } from './asset-room.service';
import { UseJwt } from '../../auth/auth.decorator';
import { UpdateAssetRoomDto } from './dto/update-asset-room.dto';
import { CreateAssetRoomDto } from './dto/create-asset-room.dto';

// import { FirebaseService } from '../firebase/firebase.service';

@Controller('asset-rooms')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('AssetRooms')
export class AssetRoomController extends BaseController {
  private logger = new Logger(AssetRoomController.name);

  constructor(private readonly assetRoomServices: AssetRoomService) {
    super();
  }

  async UpdateAssetModel(
    @Body() dto: UpdateAssetRoomDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.assetRoomServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.assetRoomServices.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        json['floor']['_id'] = json['floor']['_id'].toString();
        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':assetRoomId')
  async getAssetModel(@Param('assetRoomId') assetRoomId: string) {
    return await this.run(async () => {
      const result = (
        await this.assetRoomServices.findOne(assetRoomId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createAssetRoom(@Body() dto: CreateAssetRoomDto) {
    try {
      return (await this.assetRoomServices.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':assetRoomId')
  async updateAssetRoom(
    @Param('assetRoomId') accountId: string,
    @Body() dto: UpdateAssetRoomDto,
  ) {
    try {
      return (await this.assetRoomServices.update(accountId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':assetRoomId')
  async deleteAssetRoom(@Param('assetRoomId') assetRoomId: string) {
    return await this.run(async () => {
      return await this.assetRoomServices.deleteOne(assetRoomId);
    });
  }
}
