import { PartialType } from '@nestjs/swagger';
import { CreateTvProgramDto } from './create-program.dto';

export class UpdateTvProgramDto extends PartialType(CreateTvProgramDto) {}
