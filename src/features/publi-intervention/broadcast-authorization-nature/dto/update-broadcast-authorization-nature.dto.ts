import { PartialType } from '@nestjs/swagger';
import { CreateBroadcastAuthorizationNatureDto } from './create-broadcast-authorization-nature.dto';

export class UpdateBroadcastAuthorizationNatureDto extends PartialType(
  CreateBroadcastAuthorizationNatureDto,
) {}
