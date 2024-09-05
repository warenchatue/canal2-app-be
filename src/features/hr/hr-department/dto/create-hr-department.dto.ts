import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHrDepartmentDto {
  @ApiPropertyOptional({ default: 'Dep01' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'HR Dep' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'acc desc' })
  @IsNotEmpty()
  description: string;
}
