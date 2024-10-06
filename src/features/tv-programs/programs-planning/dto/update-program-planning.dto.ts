import { OmitType } from '@nestjs/swagger';
import { CreateProgramPlanningDto } from './create-program-planning.dto';

export class UpdatePlanningDto extends OmitType(CreateProgramPlanningDto, []) {}
