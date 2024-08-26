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
import { UpdateProgramCategoryDto } from './dto/update-program-category.dto';
import { ProgramCategoriesService } from './program-categories.service';
import { CreateProgramCategoryDto } from './dto/create-program-category.dto';
import { UseJwt } from 'src/features/auth/auth.decorator';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('program-categories')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('ProgramCategories')
export class ProgramCategoriesController extends BaseController {
  private logger = new Logger(ProgramCategoriesController.name);

  constructor(
    private readonly articleCategoriesServices: ProgramCategoriesService,
  ) {
    super();
  }

  async updateProgramCategory(
    @Body() dto: UpdateProgramCategoryDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.articleCategoriesServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.articleCategoriesServices.find();
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
  @Get(':programCategoryId')
  async getAccount(@Param('programCategoryId') programCategoryId: string) {
    return await this.run(async () => {
      const result = (
        await this.articleCategoriesServices.findOne(programCategoryId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createProgramCategory(@Body() dto: CreateProgramCategoryDto) {
    try {
      const article = await (
        await this.articleCategoriesServices.create(dto)
      ).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':programCategoryId')
  async updateAccount(
    @Param('programCategoryId') accountId: string,
    @Body() dto: UpdateProgramCategoryDto,
  ) {
    try {
      const article = await (
        await this.articleCategoriesServices.update(accountId, dto)
      ).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':programCategoryId')
  async deleteProgramCategory(
    @Param('programCategoryId') programCategoryId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.articleCategoriesServices.deleteOne(programCategoryId);
    });
  }
}
