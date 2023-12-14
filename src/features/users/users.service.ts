import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { SALT_ROUND } from 'src/common/vars';
// import { NOTIFICATION_PUSH_EVENT } from '../notifications/notifiactions.handler';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService extends DeletableMixin<User> {
  constructor(
    @InjectModel(User.name)
    private readonly users: Model<UserDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateUserDto) {
    return this.users.create({
      ...dto,
      password: bcrypt.hashSync(dto.password, 10),
    });
  }

  findByEmail(email: string) {
    return this.users
      .findOne({ email })
      .populate([
        {
          path: 'appRole',
          model: 'Role',
        },
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }

  findByPhone(phone: string) {
    return this.users.findOne({ phone }).exec();
  }

  findOne(_id: string) {
    return this.users
      .findById(_id)
      .orFail()
      .populate([
        {
          path: 'appRole',
          model: 'Role',
        },
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }

  find(states = [State.active]) {
    return this.users
      .find()
      .where('state')
      .in(states)
      .populate([
        {
          path: 'appRole',
          model: 'Role',
        },
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }

  findAll() {
    return this.users
      .find()
      .populate([
        {
          path: 'appRole',
          model: 'Role',
        },
        {
          path: 'country',
          model: 'Country',
        },
      ])
      .exec();
  }

  async update(_id: string, dto: UpdateUserDto) {
    return await this.users
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async pushNotification(_id: string, notificationId: string) {
    const result = await this.users
      .findByIdAndUpdate(_id, {
        $push: { notifications: notificationId },
      })
      .orFail()
      .exec();

    // this.event.emit(NOTIFICATION_PUSH_EVENT, { notificationId, topic: _id });
    return result;
  }

  findNotifications(_id: string) {
    return this.users
      .findById(_id)
      .select('notifications')
      .populate('notifications')
      .orFail()
      .exec();
  }

  resetPassword(email: string, password: string) {
    return this.users
      .findOneAndUpdate(
        { email },
        { $set: { password: bcrypt.hashSync(password, SALT_ROUND) } },
        { new: true },
      )
      .orFail()
      .exec();
  }

  phoneExists(phone: string) {
    return this.users
      .findOne({ phone })
      .populate('_id')
      .select(['email', 'phone', 'firstName', 'lastName', 'team'])
      .transform((doc) => {
        return {
          _id: doc._id.toString(),
          phone: doc.phone,
          firstName: doc.firstName,
          lastName: doc.lastName,
          email: doc.email,
          team: doc.team,
        };
      })
      .orFail()
      .exec();
  }

  async incrementOrgs(_id: string, value = 1) {
    const account = await this.users.findById(_id);
    account.orgsCount += value;
    return account.save();
  }

  async incrementOwnedOrgs(_id: string, value = 1) {
    const account = await this.users.findById(_id);
    account.orgsCount += value;
    account.ownedOrgs += value;
    return account.save();
  }

  async incrementNotificationsBulk(users: string[], value = 1) {
    return this.users.updateMany(
      { _id: { $in: users } },
      { $inc: { notificationsCount: value } },
    );
  }

  async incrementNotifications(_id: string, value = 1) {
    const account = await this.users.findById(_id).orFail();
    account.notificationsCount += value;
    return account.save();
  }

  countUnreadNotifications(_id: string) {
    return this.users.findById(_id).select('notificationsCount').exec();
  }

  updateAccount(_id: string, { email, phone }) {
    return this.users
      .findByIdAndUpdate(_id, { $set: { email, phone } })
      .orFail()
      .exec();
  }

  findByPhones(phones: string[]) {
    return this.users
      .find({ phone: phones.map((phone) => new RegExp(phone + '$', 'i')) })
      .select(['phone'])
      .transform((docs) => {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          phone: doc.phone,
        }));
      })
      .exec();
  }
}
