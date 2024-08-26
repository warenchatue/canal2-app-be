import { OmitType } from '@nestjs/swagger';
import { CreateAssetBrandDto } from './create-asset-brand.dto';

export class UpdateAssetBrandDto extends OmitType(CreateAssetBrandDto, []) {}
