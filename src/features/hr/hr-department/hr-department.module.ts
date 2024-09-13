import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HrDepartmentHandler } from './hr-department.handler';
import {
  HrDepartment,
  HrDepartmentSchema,
} from './entities/hr-department.entity';
import { HrDepartmentService } from './hr-department.service';
import { HrDepartmentController } from './hr-department.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HrDepartment.name, schema: HrDepartmentSchema },
    ]),
  ],
  controllers: [HrDepartmentController],
  providers: [HrDepartmentService, HrDepartmentHandler],
  exports: [HrDepartmentService],
})
export class HrDepartmentModule {}
