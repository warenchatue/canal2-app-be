import { OmitType } from '@nestjs/swagger';
import { CreateAssetRoomDto } from './create-asset-room.dto';

export class UpdateAssetRoomDto extends OmitType(CreateAssetRoomDto, []) {}
