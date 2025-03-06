import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBroadcastAuthorizationNatureDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string; // e.g., Nous Chez vous!, Publ Info, etc.

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string; // e.g., Publi, PAD, ProgramIntervention, etc.

  @ApiProperty()
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  program_id: string;
}
