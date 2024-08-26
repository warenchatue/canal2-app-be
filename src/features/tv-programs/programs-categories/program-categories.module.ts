import { Module } from '@nestjs/common';
import { ProgramCategoriesService } from './program-categories.service';
import { ProgramCategoriesController } from './program-categories.controller';
import {
  ProgramCategory,
  ProgramCategorySchema,
} from './entities/program-category.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgramCategoriesHandler } from './program-categories.handler';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgramCategory.name, schema: ProgramCategorySchema },
    ]),
  ],
  controllers: [ProgramCategoriesController],
  providers: [ProgramCategoriesService, ProgramCategoriesHandler],
  exports: [ProgramCategoriesService],
})
export class ProgramCategoriesModule {}
