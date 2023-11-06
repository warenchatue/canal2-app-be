import { Prop, Schema } from '@nestjs/mongoose';
import { IDeletable } from '../mixins/deletable.mixin';

export enum State {
  active = 'active',
  trashed = 'trashed',
  archived = 'archived',
  deleted = 'deleted',
}
@Schema()
export class BaseSchema implements IDeletable {
  @Prop({ enum: State, default: State.active })
  state: State;

  @Prop()
  deletedAt: Date;

  @Prop()
  archivedAt: Date;

  @Prop()
  trashedAt: Date;
}
