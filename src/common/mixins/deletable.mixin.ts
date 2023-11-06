import { State } from '../shared/base-schema';
import { Document, Types } from 'mongoose';

export interface IDeletable {
  state: State;
  deletedAt: Date;
  archivedAt: Date;
  trashedAt: Date;
}

type Result<T> =
  | NonNullable<T & Document<any, any, any> & { _id: Types.ObjectId }>
  | any;

export abstract class DeletableMixin<T> {
  public abstract findOne(_id: string): Promise<Result<T & IDeletable>>;

  async deleteOne(_id: string): Promise<Result<T>> {
    const item = await this.findOne(_id);

    switch (item.state) {
      case State.active:
        item.state = State.trashed;
        item.trashedAt = new Date();
        break;
      case State.trashed:
      case State.archived:
        item.state = State.deleted;
        item.deletedAt = new Date();
        break;
    }

    return item.save();
  }
}
