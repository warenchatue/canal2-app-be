import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetRoomDto {
  @ApiPropertyOptional({ default: 'Bureau' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ default: 'New Room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Desc' })
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  floor: string;
}
