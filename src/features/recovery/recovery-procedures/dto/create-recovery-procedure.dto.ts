import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString, Max, Min } from 'class-validator';
import { toBoolean } from 'src/common/helpers';
export class CreateRecoveryProcedureDto {
  @ApiPropertyOptional({ example: 'My awesome bill' })
  @IsString()
  label: string;

  @ApiPropertyOptional({ example: 'REC/2023/001' })
  code: string;

  @ApiPropertyOptional({ example: 'dd/mm/yyyy' })
  date: string;

  @ApiProperty()
  @IsString()
  creator: string;

  @ApiProperty()
  @IsString()
  agent1: string;

  @ApiProperty()
  @IsString()
  agent2: string;

  @ApiProperty()
  @IsString()
  agent3: string;

  @ApiProperty()
  @IsString()
  agent4: string;

  @ApiPropertyOptional()
  @IsString()
  announcer: string;

  @ApiPropertyOptional()
  @IsString()
  validator: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiPropertyOptional({ default: false })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  closed: boolean;

  @ApiPropertyOptional({ example: 'My awesome package description' })
  @IsString()
  @Min(15)
  @Max(512)
  description?: string;

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  paid?: number;

  @ApiPropertyOptional({ example: '[]' })
  items?: any[];
}
