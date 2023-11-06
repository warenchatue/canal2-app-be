import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ default: 'Cameroon' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 'CMR' })
  @IsString()
  abbr: string;

  @ApiPropertyOptional({ example: '+237' })
  @IsNotEmpty()
  dial: string;

  @ApiPropertyOptional({ example: 'htttps://' })
  @IsNotEmpty()
  flag: string;
}
