import { OmitType } from '@nestjs/swagger';
import { CreateHourDto } from './create-hour.dto';

export class UpdateHourDto extends OmitType(CreateHourDto, []) {}
