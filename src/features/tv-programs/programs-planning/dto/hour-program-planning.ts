import { ApiProperty } from '@nestjs/swagger';

export class HourProgramPlanningDto {
  @ApiProperty()
  hour: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  date: string;
}
