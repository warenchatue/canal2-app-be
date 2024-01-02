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
import { UpdateArticleCategoryDto } from './dto/update-article-catogory.dto';
import { ArticleCategoriesService } from './article-categories.service';
import { CreateArticleCategoryDto } from './dto/create-article-category.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('article-categories')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('ArticleCategories')
export class ArticleCategoriesController extends BaseController {
  private logger = new Logger(ArticleCategoriesController.name);

  constructor(
    private readonly articleCategoriesServices: ArticleCategoriesService,
  ) {
    super();
  }

  async updateArticleCategory(
    @Body() dto: UpdateArticleCategoryDto,
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
  @Get(':articleCategoryId')
  async getAccount(@Param('articleCategoryId') articleCategoryId: string) {
    return await this.run(async () => {
      const result = (
        await this.articleCategoriesServices.findOne(articleCategoryId)
      ).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createArticleCategory(@Body() dto: CreateArticleCategoryDto) {
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
  @Put(':articleCategoryId')
  async updateAccount(
    @Param('articleCategoryId') accountId: string,
    @Body() dto: UpdateArticleCategoryDto,
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
  @Delete(':articleCategoryId')
  async deleteArticleCategory(
    @Param('articleCategoryId') articleCategoryId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.articleCategoriesServices.deleteOne(articleCategoryId);
    });
  }
}
