import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';
import { AssetFloor } from '../../asset-floor/entities/asset-floor.entity';

@Schema({ timestamps: true })
export class AssetRoom extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => AssetFloor })
  floor: sc.Types.ObjectId | string;
}

export type AssetRoomDocument = AssetRoom & Document;
export const AssetRoomSchema = SchemaFactory.createForClass(AssetRoom);
