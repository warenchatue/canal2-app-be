import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExpenseCategoryDto {
  @ApiPropertyOptional({ default: 'CE' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: "Charge d'exploitation" })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Desc' })
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ default: 1 })
  @IsString()
  level: string;

  @ApiPropertyOptional()
  @IsString()
  parent: string;
}
