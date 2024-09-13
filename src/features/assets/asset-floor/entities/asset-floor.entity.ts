import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class AssetFloor extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  level: string;
}

export type AssetFloorDocument = AssetFloor & Document;
export const AssetFloorSchema = SchemaFactory.createForClass(AssetFloor);
