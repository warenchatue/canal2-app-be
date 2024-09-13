import { Module } from '@nestjs/common';
import { HrPersonnelService } from './hr-personnel.service';
import { HrPersonnelController } from './hr-personnel.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HrPersonnelHandler } from './hr-personnel.handler';
import { HrPersonnel, HrPersonnelSchema } from './entities/hr-personnel.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HrPersonnel.name, schema: HrPersonnelSchema },
    ]),
  ],
  controllers: [HrPersonnelController],
  providers: [HrPersonnelService, HrPersonnelHandler],
  exports: [HrPersonnelService],
})
export class HrPersonnelModule {}
