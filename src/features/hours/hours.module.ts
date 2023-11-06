import { Module } from '@nestjs/common';
import { Hour, HourSchema } from './entities/hour.entity';
import { HoursService } from './hours.service';
import { HoursController } from './hours.controller';
import { HoursHandler } from './hours.handler';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hour.name, schema: HourSchema }]),
  ],
  controllers: [HoursController],
  providers: [HoursService, HoursHandler],
  exports: [HoursService],
})
export class HoursModule {}
