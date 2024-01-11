import { OmitType } from '@nestjs/swagger';
import { CreateJournalDto } from './create-journal.dto';

export class UpdateJournalDto extends OmitType(CreateJournalDto, []) {}
