import { PartialType } from '@nestjs/swagger';
import { CreateBroadcastAuthorizationDto } from './create-broadcast-authorization.dto';

export class UpdateBroadcastAuthorizationDto extends PartialType(
  CreateBroadcastAuthorizationDto,
) {}
