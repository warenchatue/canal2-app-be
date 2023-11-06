import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role, RoleDocument } from './entities/role.entity';
import * as bcrypt from 'bcrypt';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeletableMixin } from 'src/common/mixins/deletable.mixin';
import { State } from 'src/common/shared/base-schema';
import { SALT_ROUND } from 'src/common/vars';
// import { NOTIFICATION_PUSH_EVENT } from '../notifications/notifiactions.handler';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RolesService extends DeletableMixin<Role> {
  constructor(
    @InjectModel(Role.name)
    private readonly roles: Model<RoleDocument>,
    private readonly event: EventEmitter2,
  ) {
    super();
  }

  create(dto: CreateRoleDto) {
    return this.roles.create({
      ...dto,
    });
  }

  findByName(name: string) {
    return this.roles.findOne({ name }).exec();
  }

  findOne(_id: string) {
    return this.roles.findById(_id).orFail().exec();
  }

  find(states = [State.active]) {
    return this.roles.find().where('state').in(states).exec();
  }

  findAll() {
    return this.roles.find();
  }

  async update(_id: string, dto: UpdateRoleDto) {
    return await this.roles
      .findByIdAndUpdate(_id, { $set: dto }, { new: true })
      .orFail()
      .exec();
  }

  async pushNotification(_id: string, notificationId: string) {
    const result = await this.roles
      .findByIdAndUpdate(_id, {
        $push: { notifications: notificationId },
      })
      .orFail()
      .exec();

    // this.event.emit(NOTIFICATION_PUSH_EVENT, { notificationId, topic: _id });
    return result;
  }
}
