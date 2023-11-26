import { OmitType } from '@nestjs/swagger';
import { CreatePlanningDto } from './create-planning.dto';

export class UpdatePlanningDto extends OmitType(CreatePlanningDto, []) {}
