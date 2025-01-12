import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { HrServiceStatus } from '../entities/hr-service.entity';

export class CreateHrServiceDto {
  @ApiPropertyOptional({ default: '7011' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(HrServiceStatus)
  status?: HrServiceStatus;

  @ApiPropertyOptional({ default: 'hr dept' })
  @IsString()
  department: string;

  @ApiProperty({ example: 'hr service desc' })
  @IsNotEmpty()
  description: string;
}
