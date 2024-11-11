import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PlanningContentDto {
  @ApiProperty({ default: 'content...' })
  @IsString()
  content: string;
}
