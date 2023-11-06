import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FetchAccountsDto {
  @ApiProperty({ example: ['690909090', '670707070', '660606060'].toString() })
  @IsNotEmpty()
  @IsString()
  phones: string;
}
