import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateNotificationVisibility {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  display: boolean;
}
