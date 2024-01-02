import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article, ArticleSchema } from './entities/article.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesHandler } from './articles.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesHandler],
  exports: [ArticlesService],
})
export class ArticlesModule {}
