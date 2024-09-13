import { OmitType } from '@nestjs/swagger';
import { CreateHrServiceDto } from './create-hr-service.dto';

export class UpdateHrServiceDto extends OmitType(CreateHrServiceDto, []) {}
