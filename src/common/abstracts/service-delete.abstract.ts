import { Document, Types } from 'mongoose';
import { State } from '../shared/base-schema';

export abstract class ServiceDeleteAbstract<T> {
  public abstract findOne(_id: string);

  async deleteOne(_id): Promise<
    NonNullable<
      T &
        Document<any, any, any> & {
          _id: Types.ObjectId;
        }
    >
  > {
    const item = await this.findOne(_id);

    switch (item.state) {
      case State.active:
        item.state = State.trashed;
        item.trashedAt = new Date();
        break;
      case State.trashed:
      default:
        item.state = State.deleted;
        item.deletedAt = new Date();
        break;
    }

    return item.save();
  }
}
