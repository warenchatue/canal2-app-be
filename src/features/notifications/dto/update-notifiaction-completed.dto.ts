import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class updateNotificationCompletedDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;
}
