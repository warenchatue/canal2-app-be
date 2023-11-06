import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddViewerDto {
  @ApiProperty()
  @IsNotEmpty()
  viewer: string;
}
