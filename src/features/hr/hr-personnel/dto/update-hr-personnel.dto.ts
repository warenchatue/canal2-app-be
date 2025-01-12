import { OmitType } from '@nestjs/swagger';
import { CreateHrPersonnelDto } from './create-hr-personnel.dto';

export class UpdateHrPersonnelDto extends OmitType(CreateHrPersonnelDto, []) {}
