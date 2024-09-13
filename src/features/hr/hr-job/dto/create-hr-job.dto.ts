import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsObject,
  IsDate,
} from 'class-validator';
import { JobStatus } from '../entities/hr-job.entity';
import { Type } from 'class-transformer';

class SalaryRangeDto {
  @ApiProperty({
    example: 50000,
    description: 'Minimum salary for the position',
  })
  @IsNotEmpty()
  @IsNumber()
  min: number;

  @ApiProperty({
    example: 80000,
    description: 'Maximum salary for the position',
  })
  @IsNotEmpty()
  @IsNumber()
  max: number;
}

export class CreateHrJobDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Responsible for developing and maintaining software systems.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Reference ID for the department (HrDepartment)',
  })
  @IsOptional()
  @IsString()
  department: Types.ObjectId | string;

  @ApiPropertyOptional({
    type: String,
    description: 'Reference ID for the position (HrPosition)',
  })
  @IsOptional()
  @IsString()
  position: Types.ObjectId | string;

  @ApiProperty({
    type: SalaryRangeDto,
    description: 'Salary range for the position',
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => SalaryRangeDto)
  salaryRange: SalaryRangeDto;

  @ApiPropertyOptional({
    enum: JobStatus,
    default: JobStatus.OPEN,
    description: 'Current status of the job listing',
  })
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @ApiProperty({ example: 'New York' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Deadline for job applications',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  applicationDeadline: Date;
}
