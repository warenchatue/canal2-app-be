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
import { AssetBrandService } from './asset-brand.service';
import { UseJwt } from '../../auth/auth.decorator';
import { UpdateAssetBrandDto } from './dto/update-asset-brand.dto';
import { CreateAssetBrandDto } from './dto/create-asset-brand.dto';

// import { FirebaseService } from '../firebase/firebase.service';

@Controller('asset-brands')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('AssetBrands')
export class AssetBrandController extends BaseController {
  private logger = new Logger(AssetBrandController.name);

  constructor(private readonly assetBrandServices: AssetBrandService) {
    super();
  }

  async UpdateAssetBrand(
    @Body() dto: UpdateAssetBrandDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.assetBrandServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.assetBrandServices.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        // json['brand']['_id'] = json['brand']['_id'].toString();
        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':assetBrandId')
  async getAccount(@Param('assetBrandId') assetBrandId: string) {
    return await this.run(async () => {
      const result = (
        await this.assetBrandServices.findOne(assetBrandId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createAssetBrand(@Body() dto: CreateAssetBrandDto) {
    try {
      return (await this.assetBrandServices.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':assetBrandId')
  async updateAccount(
    @Param('assetBrandId') accountId: string,
    @Body() dto: UpdateAssetBrandDto,
  ) {
    try {
      return (await this.assetBrandServices.update(accountId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':assetBrandId')
  async deleteAssetBrand(@Param('assetBrandId') assetBrandId: string) {
    return await this.run(async () => {
      return await this.assetBrandServices.deleteOne(assetBrandId);
    });
  }
}
