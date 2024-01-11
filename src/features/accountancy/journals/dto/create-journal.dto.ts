import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateJournalDto {
  @ApiPropertyOptional({ default: 'JA' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'Journal des Achats' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ default: 0 })
  @IsString()
  position: string;

  @ApiProperty({ example: 'acc desc' })
  description: string;

  @ApiPropertyOptional()
  accounts?: string[];

  @ApiPropertyOptional()
  org?: string;
}
