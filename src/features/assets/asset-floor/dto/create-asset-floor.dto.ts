import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetFloorDto {
  @ApiPropertyOptional({ default: 'Floor01' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'Level 1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Desc' })
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Floor Level' })
  level: string;
}
