import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class getNotPlayDto {
  @ApiProperty({ default: '2023...' })
  @IsString()
  beginDate: Date;

  @ApiProperty({ default: '2023...' })
  @IsString()
  endDate: Date;
}
