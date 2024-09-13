import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHrAddressDto {
  @ApiPropertyOptional({ default: 'pos001' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 'intern' })
  @IsString()
  street: string;

  @ApiPropertyOptional({ default: 'intern' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'hr pos desc' })
  @IsNotEmpty()
  description: string;
}
