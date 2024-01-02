import { PartialType } from '@nestjs/swagger';
import { CreateAccountingDocDto } from './create-accounting-docs.dto';

export class UpdateAccountingDocDto extends PartialType(CreateAccountingDocDto) {}
