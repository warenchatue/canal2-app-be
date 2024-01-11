import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocTypeDto {
  @ApiPropertyOptional({ default: '7011' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'Facture' })
  @IsString()
  label: string;

  @ApiProperty({ example: 'doc type desc' })
  @IsNotEmpty()
  @IsEmail()
  description: string;
}
