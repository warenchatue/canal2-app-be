import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EmploymentStatus } from '../entities/hr-personnel.entity';
import { Type } from 'class-transformer';

export class EmergencyContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Spouse' })
  @IsNotEmpty()
  @IsString()
  relationship: string;
}

export class CreateHrPersonnelDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Male' })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 60000 })
  @IsNumber()
  @IsOptional()
  salary: number;

  @ApiPropertyOptional({ type: [EmergencyContactDto] }) // Define it as an array in Swagger
  @ValidateNested({ each: true }) // Validate each item in the array
  @Type(() => EmergencyContactDto) // Transform each item to EmergencyContactDto
  @IsArray() // Ensure it's an array
  @IsOptional() // Make it optional if necessary
  emergencyContact?: EmergencyContactDto[];

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  manager: string;

  @ApiPropertyOptional({
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE,
  })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  employmentStatus: EmploymentStatus;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  position: string;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  address: string;

  // @ApiPropertyOptional({ type: String })
  // @IsString()
  // @IsOptional()
  // userId: string;
}
