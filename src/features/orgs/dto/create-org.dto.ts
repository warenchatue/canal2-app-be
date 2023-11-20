import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrgDto {
  @ApiProperty({ example: 'My org', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'my-org', required: true })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'myorg@gmail.com', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'http://', required: false })
  @IsString()
  website?: string;

  @ApiProperty({ example: '{}', required: false })
  country?: any;

  @ApiProperty({ example: '{}', required: false })
  medias?: any;

  @ApiPropertyOptional({
    example: "My awesome org's description",
    required: false,
  })
  @IsString()
  description?: string;
}
