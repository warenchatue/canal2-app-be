import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'johndoe@gmail.com' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ default: 'secret' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
