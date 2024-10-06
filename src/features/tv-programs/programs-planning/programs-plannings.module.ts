import { Module, forwardRef } from '@nestjs/common';
import {
  ProgramPlanning,
  ProgramPlanningSchema,
} from './entities/program-planning.entity';
import { ProgramPlanningsService } from './plannings.service';
import { PlanningsController } from './programs-plannings.controller';
import { PlanningsHandler } from './plannings.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesModule } from 'src/features/pub/packages/packages.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProgramPlanning.name, schema: ProgramPlanningSchema },
    ]),
    forwardRef(() => PackagesModule),
  ],
  controllers: [PlanningsController],
  providers: [ProgramPlanningsService, PlanningsHandler],
  exports: [ProgramPlanningsService],
})
export class ProgramPlanningsModule {}
