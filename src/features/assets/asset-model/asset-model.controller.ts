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
import { AssetModelService } from './asset-model.service';
import { UseJwt } from '../../auth/auth.decorator';
import { UpdateAssetModelDto } from './dto/update-asset-model.dto';
import { CreateAssetModelDto } from './dto/create-asset-model.dto';

// import { FirebaseService } from '../firebase/firebase.service';

@Controller('asset-models')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('AssetModels')
export class AssetModelController extends BaseController {
  private logger = new Logger(AssetModelController.name);

  constructor(private readonly assetModelServices: AssetModelService) {
    super();
  }

  async UpdateAssetModel(
    @Body() dto: UpdateAssetModelDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.assetModelServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.assetModelServices.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        // json['model']['_id'] = json['model']['_id'].toString();
        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':assetModelId')
  async getAccount(@Param('assetModelId') assetModelId: string) {
    return await this.run(async () => {
      const result = (
        await this.assetModelServices.findOne(assetModelId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createAssetModel(@Body() dto: CreateAssetModelDto) {
    try {
      return (await this.assetModelServices.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':assetModelId')
  async updateAccount(
    @Param('assetModelId') accountId: string,
    @Body() dto: UpdateAssetModelDto,
  ) {
    try {
      return (await this.assetModelServices.update(accountId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':assetModelId')
  async deleteAssetModel(@Param('assetModelId') assetModelId: string) {
    return await this.run(async () => {
      return await this.assetModelServices.deleteOne(assetModelId);
    });
  }
}
