import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrgDto {
  @ApiProperty({ example: 'My org', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'my-org', required: false })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'myorg@gmail.com', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'http://', required: false })
  @IsString()
  website?: string;

  @ApiProperty({ example: 'NC-XX', required: false })
  @IsString()
  nc?: string;

  @ApiProperty({ example: 'RC-XX', required: false })
  @IsString()
  rc?: string;

  @IsString()
  address?: string;

  @IsString()
  footerTitle?: string;

  @IsString()
  phone?: string;

  @IsString()
  phone2?: string;

  @IsString()
  city?: string;

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

  @IsString()
  logo?: string;
}
