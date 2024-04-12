import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProgramCategoryDto {
  @ApiPropertyOptional({ default: 'INFO' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'INFO' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 'black' })
  @IsString()
  color: string;

  @ApiPropertyOptional({ default: '#000000' })
  @IsString()
  colorCode: string;

  @ApiProperty({ example: 'cat desc' })
  @IsNotEmpty()
  description: string;
}
