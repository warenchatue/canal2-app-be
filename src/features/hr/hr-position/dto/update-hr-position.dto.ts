import { OmitType } from '@nestjs/swagger';
import { CreateHrPositionDto } from './create-hr-position.dto';

export class UpdateHrPositionDto extends OmitType(CreateHrPositionDto, []) {}
