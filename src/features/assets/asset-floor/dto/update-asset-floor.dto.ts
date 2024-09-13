import { OmitType } from '@nestjs/swagger';
import { CreateAssetFloorDto } from './create-asset-floor.dto';

export class UpdateAssetFloorDto extends OmitType(CreateAssetFloorDto, []) {}
