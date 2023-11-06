import { OmitType } from '@nestjs/swagger';
import { CreateAnnouncerDto } from './create-announcer.dto';

export class UpdateAnnouncerDto extends OmitType(CreateAnnouncerDto, []) {}
