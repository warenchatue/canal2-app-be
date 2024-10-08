import { ApiProperty } from '@nestjs/swagger';

export class HourProgramPlanningDto {
  @ApiProperty()
  hour: string;

  @ApiProperty()
  date: string;
}
