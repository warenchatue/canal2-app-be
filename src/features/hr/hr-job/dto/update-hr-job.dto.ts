import { OmitType } from '@nestjs/swagger';
import { CreateHrJobDto } from './create-hr-job.dto';

export class UpdateHrJobDto extends OmitType(CreateHrJobDto, []) {}
