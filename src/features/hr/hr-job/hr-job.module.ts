import { Module } from '@nestjs/common';
import { HrJobService } from './hr-job.service';
import { HrJobController } from './hr-job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HrJobHandler } from './hr-job.handler';
import { HrJob, HrJobSchema } from './entities/hr-job.entity';
// import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HrJob.name, schema: HrJobSchema }]),
  ],
  controllers: [HrJobController],
  providers: [HrJobService, HrJobHandler],
  exports: [HrJobService],
})
export class HrJobModule {}
