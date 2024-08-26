import { OmitType } from '@nestjs/swagger';
import { CreateAssetDto } from './create-asset.dto';

export class UpdateAssetDto extends OmitType(CreateAssetDto, []) {}
