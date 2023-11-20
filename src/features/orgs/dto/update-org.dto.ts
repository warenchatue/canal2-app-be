import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrgDto } from './create-org.dto';

export class UpdateOrgDto extends PartialType(CreateOrgDto) {
  @ApiProperty({ required: false })
  pending?: string[];

  @ApiProperty({ required: false })
  banned?: string[];

  @ApiProperty({ required: false })
  administrators?: string[];
}
