import { Module } from '@nestjs/common';
import { DocTypesService } from './doc-types.service';
import { DocTypesController } from './doc-types.controller';
import { DocType, DocTypeSchema } from './entities/doc-type.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { DocTypesHandler } from './doc-types.handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DocType.name, schema: DocTypeSchema }]),
  ],
  controllers: [DocTypesController],
  providers: [DocTypesService, DocTypesHandler],
  exports: [DocTypesService],
})
export class DocTypesModule {}
