import { Module, forwardRef } from '@nestjs/common';
import { Planning, PlanningSchema } from './entities/planning.entity';
import { PlanningsService } from './plannings.service';
import { PlanningsController } from './plannings.controller';
import { PlanningsHandler } from './plannings.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { PackagesModule } from '../packages/packages.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Planning.name, schema: PlanningSchema },
    ]),
    forwardRef(() => PackagesModule),
  ],
  controllers: [PlanningsController],
  providers: [PlanningsService, PlanningsHandler],
  exports: [PlanningsService],
})
export class PlanningsModule {}
