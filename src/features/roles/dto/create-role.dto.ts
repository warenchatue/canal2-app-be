import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ default: 'Admin' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 'admin' })
  @IsString()
  tag: string;

  @ApiPropertyOptional({ default: 'Admin role' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: '[]' })
  @IsNotEmpty()
  permissions: string[];
}
