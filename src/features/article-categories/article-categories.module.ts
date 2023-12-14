import { Module } from '@nestjs/common';
import { ArticleCategoriesService } from './article-categories.service';
import { ArticleCategoriesController } from './article-categories.controller';
import {
  ArticleCategory,
  ArticleCategorySchema,
} from './entities/article-category.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleCategoriesHandler } from './article-categories.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ArticleCategory.name, schema: ArticleCategorySchema },
    ]),
  ],
  controllers: [ArticleCategoriesController],
  providers: [ArticleCategoriesService, ArticleCategoriesHandler],
  exports: [ArticleCategoriesService],
})
export class ArticleCategoriesModule {}
