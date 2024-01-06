import { PartialType } from '@nestjs/swagger';
import { CreateRecoveryProcedureDto } from './create-recovery-procedure.dto';

export class UpdateRecoveryProcedureDto extends PartialType(CreateRecoveryProcedureDto) {}
