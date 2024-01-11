import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class DocType extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  label: string;

  @Prop()
  description: string;
}

export type DocTypeDocument = DocType & Document;
export const DocTypeSchema = SchemaFactory.createForClass(DocType);
