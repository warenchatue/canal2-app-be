import { OmitType } from '@nestjs/swagger';
import { CreateDocTypeDto } from './create-doc-type.dto';

export class UpdateDocTypeDto extends OmitType(CreateDocTypeDto, []) {}
