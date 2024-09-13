import { OmitType } from '@nestjs/swagger';
import { CreateHrDepartmentDto } from './create-hr-department.dto';

export class UpdateHrDepartmentDto extends OmitType(
  CreateHrDepartmentDto,
  [],
) {}
