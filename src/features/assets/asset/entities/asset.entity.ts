import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { AssetCategory } from '../../asset-category/entities/asset-category.entity';
import { AssetBrand } from '../../asset-brand/entities/asset-brand.entity';
import { AssetModel } from '../../asset-model/entities/asset-model.entity';
import { AssetRoom } from '../../asset-room/entities/asset-room.entity';

@Schema({ timestamps: true })
export class Asset extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => AssetCategory })
  category: sc.Types.ObjectId | string;

  @Prop({ type: sc.Types.ObjectId, ref: () => AssetBrand })
  brand: sc.Types.ObjectId | string;

  @Prop({ type: sc.Types.ObjectId, ref: () => AssetModel })
  model: sc.Types.ObjectId | string;

  @Prop({ type: sc.Types.ObjectId, ref: () => AssetRoom })
  room: sc.Types.ObjectId | string;
}

export type AssetDocument = Asset & Document;
export const AssetSchema = SchemaFactory.createForClass(Asset);
