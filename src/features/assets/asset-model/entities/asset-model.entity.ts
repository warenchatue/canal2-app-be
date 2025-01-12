import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class AssetModel extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;
}

export type AssetModelDocument = AssetModel & Document;
export const AssetModelSchema = SchemaFactory.createForClass(AssetModel);
