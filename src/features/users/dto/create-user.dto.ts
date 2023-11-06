import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { AccountProvider, UserType } from '../entities/user.entity';

export class CreateUserDto {
  @ApiPropertyOptional({ default: 'John' })
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ default: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'admin@test.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'secret' })
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ default: '+237690909090' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ default: UserType.personal })
  @IsNotEmpty()
  @IsEnum(UserType)
  userType?: UserType;

  @ApiProperty()
  @IsNotEmpty()
  appRole: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiProperty({ example: AccountProvider.local })
  @IsNotEmpty()
  @IsEnum(AccountProvider)
  provider?: AccountProvider;
}
