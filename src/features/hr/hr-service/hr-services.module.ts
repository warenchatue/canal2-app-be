import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HrServicesHandler } from './hr-services.handler';
import { HrServiceController } from './hr-services.controller';
import { HrService, HrServiceSchema } from './entities/hr-service.entity';
import { HrServiceService } from './hr-services.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HrService.name, schema: HrServiceSchema },
    ]),
  ],
  controllers: [HrServiceController],
  providers: [HrServiceService, HrServicesHandler],
  exports: [HrServiceService],
})
export class HrServiceModule {}
