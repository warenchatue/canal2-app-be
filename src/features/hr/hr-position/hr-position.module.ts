import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HrPositionService } from './hr-position.service';
import { HrPositionHandler } from './hr-position.handler';
import { HrPosition, HrPositionSchema } from './entities/hr-position.entity';
import { HrPositionController } from './hr-position.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HrPosition.name, schema: HrPositionSchema },
    ]),
  ],
  controllers: [HrPositionController],
  providers: [HrPositionService, HrPositionHandler],
  exports: [HrPositionService],
})
export class HrPositionModule {}
