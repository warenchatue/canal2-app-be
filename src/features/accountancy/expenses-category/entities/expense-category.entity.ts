import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as sc } from 'mongoose';
import { BaseSchema } from 'src/common/shared/base-schema';

@Schema({ timestamps: true })
export class ExpenseCategory extends BaseSchema {
  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  level: string;

  @Prop({ type: sc.Types.ObjectId, ref: () => ExpenseCategory })
  parent: sc.Types.ObjectId | string;
}

export type ExpenseCategoryDocument = ExpenseCategory & Document;
export const ExpenseCategorySchema =
  SchemaFactory.createForClass(ExpenseCategory);
