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
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
// import { FirebaseService } from '../firebase/firebase.service';

@Controller('articles')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Articles')
export class ArticlesController extends BaseController {
  private logger = new Logger(ArticlesController.name);

  constructor(private readonly articlesServices: ArticlesService) {
    super();
  }

  async updateArticle(
    @Body() dto: UpdateArticleDto,
    @Req() { user }: URequest,
  ) {
    return await this.run(
      async () => await this.articlesServices.update(user._id, dto),
    );
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get()
  async getAll() {
    return await this.run(async () => {
      const result = await this.articlesServices.find();
      const final_result = result.map((e) => {
        const json = e.toJSON();
        json['_id'] = json['_id'].toString();
        json['category']['_id'] = json['category']['_id'].toString();
        return json;
      });

      return final_result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Get(':articleId')
  async getAccount(@Param('articleId') articleId: string) {
    return await this.run(async () => {
      const result = (await this.articlesServices.findOne(articleId)).toJSON();
      console.log(result);
      return result;
    });
  }

  @ApiBearerAuth()
  @UseJwt()
  @Post()
  async createArticle(@Body() dto: CreateArticleDto) {
    try {
      const article = await (await this.articlesServices.create(dto)).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Put(':articleId')
  async updateAccount(
    @Param('articleId') accountId: string,
    @Body() dto: UpdateArticleDto,
  ) {
    try {
      const article = await (
        await this.articlesServices.update(accountId, dto)
      ).toJSON();
      return article;
    } catch (error) {
      sendError(error);
    }
  }

  @ApiBearerAuth()
  @UseJwt()
  @Delete(':articleId')
  async deleteArticle(
    @Param('articleId') articleId: string,
    @Req() { user }: URequest,
  ) {
    return await this.run(async () => {
      return await this.articlesServices.deleteOne(articleId);
    });
  }
}
