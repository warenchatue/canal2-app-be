import { ApiProperty } from '@nestjs/swagger';

export class autoValidatePlanningDto {
  @ApiProperty()
  codes: string[];
}
