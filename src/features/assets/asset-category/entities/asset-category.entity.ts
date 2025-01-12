import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class AssetCategory extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  level: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => AssetCategory })
  parent: sc.Types.ObjectId | string;
}

export type AssetCategoryDocument = AssetCategory & Document;
export const AssetCategorySchema = SchemaFactory.createForClass(AssetCategory);
