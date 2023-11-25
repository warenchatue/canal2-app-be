import { OmitType } from '@nestjs/swagger';
import { CreateTaxDto } from './create-tax.dto';

export class UpdateTaxDto extends OmitType(CreateTaxDto, []) {}
