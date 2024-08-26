import { OmitType } from '@nestjs/swagger';
import { CreateAssetModelDto } from './create-asset-model.dto';

export class UpdateAssetModelDto extends OmitType(CreateAssetModelDto, []) {}
