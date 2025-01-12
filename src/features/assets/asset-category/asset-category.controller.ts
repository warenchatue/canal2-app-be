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
import { UseJwt } from '../../auth/auth.decorator';
import { AssetCategoryService } from './asset-category.service';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';

// import { FirebaseService } from '../firebase/firebase.service';

@Controller('asset-categories')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('assetCategories')
export class AssetCategoryController extends BaseController {
  private logger = new Logger(AssetCategoryController.name);

  constructor(private readonly assetCategoryServices: AssetCategoryService) {
    super();
  }

  async updateAssetCategory(
    @Body() dto: UpdateAssetCategoryDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.assetCategoryServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.assetCategoryServices.find();
      return result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        if (json['parent']) {
          json['parent']['_id'] = json['parent']['_id'].toString();
        }

        return json;
      });
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':assetCategoryId')
  async getAccount(@Param('assetCategoryId') assetCategoryId: string) {
    return await this.run(async () => {
      const result = (
        await this.assetCategoryServices.findOne(assetCategoryId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createAssetCategory(@Body() dto: CreateAssetCategoryDto) {
    try {
      return (await this.assetCategoryServices.create(dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':assetCategoryId')
  async updateAccount(
    @Param('assetCategoryId') accountId: string,
    @Body() dto: UpdateAssetCategoryDto,
  ) {
    try {
      return (await this.assetCategoryServices.update(accountId, dto)).toJSON();
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':assetCategoryId')
  async deleteAssetCategory(@Param('assetCategoryId') assetCategoryId: string) {
    return await this.run(async () => {
      return await this.assetCategoryServices.deleteOne(assetCategoryId);
    });
  }
}
