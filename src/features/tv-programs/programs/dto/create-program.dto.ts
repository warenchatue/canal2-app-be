import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsString, Max, Min } from 'class-validator';
import { toBoolean } from 'src/common/helpers';
export class CreateTvProgramDto {
  @ApiProperty({ example: 'PROG_001' })
  code: string;

  @ApiProperty({ example: 'Canal Matin' })
  name: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  duration: number;

  @ApiProperty({ example: [] })
  @IsArray()
  plannings: number[];

  @ApiProperty()
  @IsString()
  creator: string;

  @ApiProperty()
  @IsString()
  host: string;

  @ApiProperty()
  @IsString()
  host2: string;

  @ApiPropertyOptional()
  @IsString()
  hosts: string[];

  @ApiPropertyOptional()
  @IsString()
  validator: string;

  @ApiPropertyOptional()
  @IsString()
  validatorSignature: string;

  @ApiPropertyOptional()
  @IsString()
  adminValidator: string;

  @ApiPropertyOptional()
  adminValidated: boolean;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  closed: boolean;

  @ApiPropertyOptional({ example: 'My awesome tvProgram description' })
  @IsString()
  @Min(15)
  @Max(512)
  description?: string;

  @ApiPropertyOptional({ example: '' })
  org?: string;
}
