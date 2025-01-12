import { OmitType } from '@nestjs/swagger';
import { CreateHrAddressDto } from './create-hr-address.dto';

export class UpdateHrAddressDto extends OmitType(CreateHrAddressDto, []) {}
