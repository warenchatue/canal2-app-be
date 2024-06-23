import { ApiProperty } from '@nestjs/swagger';

export class manualValidatePlanningDto {
  @ApiProperty()
  packageId: string;

  @ApiProperty()
  _ids: string[];
}
